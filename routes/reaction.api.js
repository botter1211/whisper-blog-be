const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const reactionController = require("../controllers/reaction.controller");
/**
 * @route POST /reactions
 * @description Save a reaction to blog
 * @access login required
 * @body {blogId, type: 'like'}
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("blogId", "Invalid blogId").exists().custom(validators.checkObjectId),
    body("type", "Invalid type").exists().isIn(["like"]),
  ]),
  reactionController.saveReaction
);
router.get(
  "/",
  authentication.loginRequired,

  reactionController.getReaction
);
router.get(
  "/",
  authentication.loginRequired,

  reactionController.getAllReactionOfUser
);
module.exports = router;
