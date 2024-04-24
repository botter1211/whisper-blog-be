const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = Schema(
  {
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Follow = mongoose.model("Follow", followSchema);
module.exports = Follow;
