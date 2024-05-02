const express = require("express");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
const { param, body } = require("express-validator");
const subscriptionController = require("../controllers/subscription.controller");
const router = express.Router();

/**
 * @route POST /subscription
 * @description Buy subscription
 * @access login required
 * @body {buyerId, expiredDate}
 */
router.post(
  "/30days",

  authentication.loginRequired,
  subscriptionController.buySubscription30days
);
router.post(
  "/180days",

  authentication.loginRequired,
  subscriptionController.buySubscription180days
);
router.post(
  "/365days",

  authentication.loginRequired,
  subscriptionController.buySubscription365days
);
router.get(
  "/:userId",

  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  subscriptionController.getSubscription
);

module.exports = router;
