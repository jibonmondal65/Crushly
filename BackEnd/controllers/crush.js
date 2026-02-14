const Crush = require("../models/crush");
const User = require("../models/user");
const Profile = require("../models/profile");
const Notification = require("../models/notification");
const { keepLast100Notifications } = require("./HelperFunctions/Keep10Notifications");

const addCrush = async (req, res) => {
  try {
    const me = req.user;
    const { firstName, lastName } = req.body;

    // Find matching verified users
    const matchingUsers = await User.find({
      firstName: new RegExp(`^${firstName}$`, "i"),
      ...(lastName && {
        lastName: new RegExp(`^${lastName}$`, "i"),
      }),
      isEmailVerified: true,
    });

    // If no user found - store name-only crush
    if (!matchingUsers.length) {
      await Crush.create({
        fromUser: me._id,
        toFirstName: firstName.toLowerCase(),
        toLastName: lastName?.toLowerCase() || "",
        toUser: null,
        pairKey: null,
      });

      return res.json({ message: "Crush added 👀" });
    }

    // If users found - create separate crush for each
    for (const target of matchingUsers) {

      const pairKey = [me._id.toString(), target._id.toString()]
        .sort()
        .join("_");

      // Prevent duplicate pair
      const existing = await Crush.findOne({
        fromUser: me._id,
        pairKey,
      });

      if (existing) continue;

      await Crush.create({
        fromUser: me._id,
        toFirstName: target.firstName.toLowerCase(),
        toLastName: target.lastName.toLowerCase(),
        toUser: target._id,
        pairKey,
      });

      // await Notification.create({
      //   user: target._id,
      //   type: "new_crush",
      //   message: `${me.firstName} has added you as a crush 💘`,
      //   relatedUser: me._id,
      // });


      const reverse = await Crush.findOne({
        fromUser: target._id,
        toUser: me._id,
      });

      if (reverse) {

        await Crush.updateMany(
          { pairKey },
          { matchLevel: "full" }
        );


        await Notification.create({
          user: me._id,
          type: "mutual_match",
          message: `You matched with ${target.firstName} 💞`,
          relatedUser: target._id,
        });

        await Notification.create({
          user: target._id,
          type: "mutual_match",
          message: `You matched with ${me.firstName} 💞`,
          relatedUser: me._id,
        });

        await keepLast100Notifications(target._id);
      }
    }

    res.json({ message: "Crush added 👀" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getPendingMatches = async (req, res) => {
  const userId = req.user._id;

  const matches = await Crush.find({
    matchLevel: "full",
    isFinalMatch: false,
    pairKey: { $exists: true },
    $or: [{ fromUser: userId }, { toUser: userId }],
  })
    .populate("fromUser", "firstName")
    .populate("toUser", "firstName");

  const results = await Promise.all(
    matches.map(async (crush) => {
      const fromProfile = await Profile.findOne({ user: crush.fromUser._id });
      const toProfile = await Profile.findOne({ user: crush.toUser._id });

      return {
        ...crush.toObject(),
        fromUser: {
          ...crush.fromUser.toObject(),
          avatar: fromProfile?.avatar || null,
        },
        toUser: {
          ...crush.toUser.toObject(),
          avatar: toProfile?.avatar || null,
        },
      };
    })
  );

  res.json(results);
};


const confirmMatch = async (req, res) => {
  const { crushId } = req.body;
  const userId = req.user._id;

  const crush = await Crush.findById(crushId)
    .populate("fromUser")
    .populate("toUser");

  if (!crush) {
    return res.status(404).json({ message: "Match not found" });
  }

  let otherUser;

  if (crush.fromUser._id.equals(userId)) {
    crush.fromConfirmed = true;
    otherUser = crush.toUser;
  }

  if (crush.toUser?._id.equals(userId)) {
    crush.toConfirmed = true;
    otherUser = crush.fromUser;
  }


  await crush.save();

  await Notification.create({
    user: otherUser._id,
    type: "confirmation",
    message: `${req.user.firstName} confirmed the match 💖`,
    relatedUser: userId,
  });

  await keepLast100Notifications(otherUser._id);

  
  if (crush.fromConfirmed && crush.toConfirmed) {
    await Crush.updateMany(
      { pairKey: crush.pairKey },
      { isFinalMatch: true }
    );
  }

  res.json({
    message:
      crush.fromConfirmed && crush.toConfirmed
        ? "💘 Match confirmed!"
        : "Waiting for other person…",
  });
};



const getFinalMatches = async (req, res) => {
  const userId = req.user._id;

  const matches = await Crush.find({
    isFinalMatch: true,
    $or: [{ fromUser: userId }, { toUser: userId }],
  })
    .populate("fromUser", "firstName")
    .populate("toUser", "firstName");

  const results = await Promise.all(
    matches.map(async (crush) => {
      const fromProfile = await Profile.findOne({ user: crush.fromUser._id });
      const toProfile = await Profile.findOne({ user: crush.toUser._id });

      return {
        ...crush.toObject(),
        fromUser: {
          ...crush.fromUser.toObject(),
          avatar: fromProfile?.avatar || null,
        },
        toUser: {
          ...crush.toUser.toObject(),
          avatar: toProfile?.avatar || null,
        },
      };
    })
  );

  res.json(results);
};

module.exports = {
  addCrush,
  getPendingMatches,
  confirmMatch,
  getFinalMatches,
};
