const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

const checkExpiredSubscription = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const expiredSubscription = await Subscription.find({
        expiredDate: { $lte: new Date.now() },
      });
      for (const subscription of expiredSubscription) {
        const { buyerId } = subscription;
        await User.findByIdAndUpdate(buyerId, { role: "reader" });
        console.log("Expired subscriptions processed successfully.");
      }
    } catch (error) {
      console.error("Error processedd expired subscription!", error);
    }
  });
};

module.exports = { checkExpiredSubscription };
