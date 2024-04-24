const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**
 * @route POST /users
 * @description Create a new user
 * @access public
 * @body {name, email, password}
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("followingId").exists().isString().custom(validators.checkObjectId),
  ]),
  followController.createFollow
);

/**
 * @route DELETE /follows/:userId
 * @description Unfollow a user
 * @access login required
 */
router.delete(
  "/:followingId",
  authentication.loginRequired,
  validators.validate([
    param("followingId").exists().isString().custom(validators.checkObjectId),
  ]),
  followController.unfollow
);

/**
 * @route GET /following
 * @description Get the list of following user
 * @access login required
 */
router.get(
  "/following",
  authentication.loginRequired,
  followController.getFollowingList
);

/**
 * @route GET /follower
 * @description Get the list of follower user
 * @access login required
 */
router.get(
  "/follower",
  authentication.loginRequired,
  followController.getFollowerList
);

module.exports = router;
