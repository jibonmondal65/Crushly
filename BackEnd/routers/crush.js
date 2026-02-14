const { Router } = require("express");
const requireProfile = require("../middlewares/requireProfile");
const {
  addCrush,
  getPendingMatches,
  confirmMatch,
  getFinalMatches,
} = require("../controllers/crush");

const crushRouter = Router();

crushRouter.post("/add",requireProfile,  addCrush);
crushRouter.get("/pending",  getPendingMatches);
crushRouter.post("/confirm",  confirmMatch);
crushRouter.get("/final",  getFinalMatches);

module.exports = crushRouter;