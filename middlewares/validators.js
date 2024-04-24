const { default: mongoose } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

const validators = {};

validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");
  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

validators.checkExpiredSubscription = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const currentUserId = user._id;
  if (!currentUserId) throw new Error("User not found");
  const expiredSubscription = await Subscription.findOne({
    buyerId: currentUserId,
    expiredDate: { $lte: Date.now() },
  });
  if (expiredSubscription) {
    await User.findByIdAndUpdate(currentUserId, { role: "reader" });
    await Subscription.findOneAndDelete({ buyerId: currentUserId });
    throw new Error("Expired Subscription");
  }
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
};

module.exports = validators;
