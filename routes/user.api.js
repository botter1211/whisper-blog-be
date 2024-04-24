const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
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
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
    body(
      "citizenId",
      "Invalid citizenId (citizenId must be number and have 12 characters)"
    )
      .optional()
      .trim()
      .isLength(12)
      .matches(/^[0-9]/),
  ]),
  userController.register
);
/**
 * @route GET /users?page=1&limit=10
 * @description get users with pagination
 * @access login required
 */
router.get("/", authentication.loginRequired, userController.getUsers);

/**
 * @route GET /users/me
 * @description Get current user info
 * @access login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access login required
 */
router.get(
  "/:slug",
  authentication.loginRequired,
  validators.validate([param("slug").exists().isString()]),
  userController.getSingleUser
);

/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body {name, avatarUrl, aboutMe, facebookLink, instagramLink, githubLink, xLink}
 * @access login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.updateProfile
);

module.exports = router;
