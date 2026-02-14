const Notification = require("../../models/notification");

const keepLast100Notifications = async (userId) => {
  const count = await Notification.countDocuments({ user: userId });

  if (count > 10) {
    const oldest = await Notification.find({ user: userId })
      .sort({ createdAt: 1 })
      .limit(count - 100);

    const ids = oldest.map(n => n._id);

    await Notification.deleteMany({ _id: { $in: ids } });
  }
};

module.exports = {
  keepLast100Notifications,
};