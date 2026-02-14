const { Router } = require("express");
const { getNotifications, markAsRead } = require("../controllers/notification");
const { checkForAuthenticationCookie } = require("../middlewares/authentication");

const notificationRouter = Router();

notificationRouter.get("/",  getNotifications);
notificationRouter.post("/read", markAsRead);

module.exports = notificationRouter;
