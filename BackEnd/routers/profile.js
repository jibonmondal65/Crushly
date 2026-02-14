const { Router } = require("express");

const profileRouter = Router();

const { createOrUpdateProfile , getMyProfile } = require('../controllers/profile');
const upload = require('../middlewares/upload');

profileRouter.put('/create', upload.single("avatar"), createOrUpdateProfile);

profileRouter.get('/me', getMyProfile);

module.exports = profileRouter;