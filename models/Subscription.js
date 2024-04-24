const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const jwt = require("jsonwebtoken");
// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const subscriptionSchema = new Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiredDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
