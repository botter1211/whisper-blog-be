const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, required: true, enum: ["like"] },
  },
  { timestamps: true }
);

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
