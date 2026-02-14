const Crush = require("../../models/crush");
const Notification = require("../../models/notification");
const { keepLast100Notifications } = require("./Keep10Notifications");

const resolvePendingCrushes = async (newUser) => {
  const firstName = newUser.firstName.toLowerCase();
  const lastName = newUser.lastName.toLowerCase();

  const pending = await Crush.find({
    toFirstName: firstName,
    toLastName: lastName,
  });

  for (const crush of pending) {

    // Skip if this exact pair already exists
    const pairKey = [crush.fromUser.toString(), newUser._id.toString()]
      .sort()
      .join("_");

    const alreadyExists = await Crush.findOne({
      fromUser: crush.fromUser,
      pairKey,
    });

    if (alreadyExists) continue;

    // Create NEW crush document instead of modifying old one
    await Crush.create({
      fromUser: crush.fromUser,
      toFirstName: firstName,
      toLastName: lastName,
      toUser: newUser._id,
      pairKey,
    });

    // Check reverse crush
    const reverse = await Crush.findOne({
      fromUser: newUser._id,
      toUser: crush.fromUser,
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
      await keepLast100Notifications(crush.fromUser);
    }
  }
};



module.exports = { resolvePendingCrushes };
