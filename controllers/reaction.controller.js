const Reaction = require("../models/Reaction.js");
const Blog = require("../models/Blog.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const mongoose = require("mongoose");

const reactionController = {};

const calculateReactions = async (blogId) => {
  const blog = await Blog.findById(blogId);
  const reactions = {
    likeCount: blog.likeCount,
  };

  return reactions;
};

reactionController.saveReaction = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { blogId, type } = req.body;

  // Check targetType exists
  const blog = await Blog.findById(blogId);
  if (!blog) throw new AppError(400, "Blog not found", "Create Reaction Error");
  // Find the reaction if exists
  let reaction = await Reaction.findOne({
    blogId,
    author: currentUserId,
  });
  // If there is no reaction in the DB -> Create new one
  if (!reaction) {
    reaction = await Reaction.create({
      blogId,
      author: currentUserId,
      type,
    });
    await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: 1 } });
  } else {
    // If there is a previous reaction in DB -> Compare the emoji
    if (type === type) {
      // If they are the same -> delete the reaction
      await reaction.deleteOne();
      await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: -1 } });
    }
  }
  const reactions = await calculateReactions(blogId);
  return sendResponse(
    res,
    200,
    true,
    reactions,
    null,
    "Save Reaction successful"
  );
});
reactionController.getReaction = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { blogId } = req.body;
  let react = await Reaction.find({ author: currentUserId });
  if (!react)
    throw new AppError(400, "Reaction not found", "Get reaction error");

  return sendResponse(res, 200, true, react, null, "Get reaction successful");
});

module.exports = reactionController;
