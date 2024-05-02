const User = require("../models/User.js");
const Subscription = require("../models/Subscription.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");

const subscriptionController = {};

subscriptionController.buySubscription30days = catchAsync(
  async (req, res, next) => {
    const buyerId = req.userId;
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    const subscription = await Subscription.create({
      buyerId,
      expiredDate,
    });

    await User.findByIdAndUpdate(buyerId, { role: "writer" });

    sendResponse(
      res,
      200,
      true,
      subscription,
      null,
      "Buy Subscription successful"
    );
  }
);
subscriptionController.buySubscription180days = catchAsync(
  async (req, res, next) => {
    const buyerId = req.userId;
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 180);
    const subscription = await Subscription.create({
      buyerId,
      expiredDate,
    });

    await User.findByIdAndUpdate(buyerId, { role: "writer" });

    sendResponse(
      res,
      200,
      true,
      subscription,
      null,
      "Buy Subscription successful"
    );
  }
);
subscriptionController.buySubscription365days = catchAsync(
  async (req, res, next) => {
    const buyerId = req.userId;
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 365);
    const subscription = await Subscription.create({
      buyerId,
      expiredDate,
    });

    await User.findByIdAndUpdate(buyerId, { role: "writer" });

    sendResponse(
      res,
      200,
      true,
      subscription,
      null,
      "Buy Subscription successful"
    );
  }
);

subscriptionController.getSubscription = catchAsync(async (req, res, next) => {
  const buyerId = req.params.userId;

  const subscription = await Subscription.find({
    buyerId,
  });

  sendResponse(
    res,
    200,
    true,
    subscription,
    null,
    "Get Subscription successful"
  );
});

module.exports = subscriptionController;
