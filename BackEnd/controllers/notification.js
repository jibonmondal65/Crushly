const Notification = require("../models/notification");

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  })
  .sort({ createdAt: -1 })
  .populate("relatedUser", "firstName");

  res.json(notifications);
};

const markAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id },
    { isRead: true }
  );

  res.json({ message: "Marked as read" });
};

module.exports = { getNotifications, markAsRead };
