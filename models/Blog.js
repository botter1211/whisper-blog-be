const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const blogSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, slug: "title" },
    coverImage: { type: String, default: "" },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
    },
    isAllowComment: { type: Boolean, default: true },
    isAllowReaction: { type: Boolean, default: true },
    canonicalUrl: { type: String, unique: true },
    commentCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
