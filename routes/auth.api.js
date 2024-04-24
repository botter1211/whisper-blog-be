const express = require("express");
const authController = require("../controllers/auth.controller");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
const { param, body } = require("express-validator");
const router = express.Router();

/**
 * @route POST /auth/login
 * @description Login with email and password
 * @access public
 * @body {email, password}
 */
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  validators.checkExpiredSubscription,
  authController.loginWithEmail
);

/**
 * @route PUT /auth/updatePassword
 * @description Change password
 * @access public
 * @body {passwordCurrent, password, passwordConfirm}
 */
router.put(
  "/updatePassword/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authentication.loginRequired,
  authController.updatePassword
);

/**
 * @route PUT /auth/forgotPassword
 * @description Change password
 * @access public
 * @body {citizenId, password, passwordConfirm}
 */
router.post(
  "/forgotPassword",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      "citizenId",
      "Invalid citizenId (citizenId must be number and have 12 characters)"
    )
      .exists()
      .notEmpty()
      .trim()
      .isLength(12)
      .matches(/^[0-9]/),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.forgotPassword
);

module.exports = router;
