const Blog = require("../models/Blog.js");
const User = require("../models/User.js");
const Follow = require("../models/Follow.js");
const Comment = require("../models/Comment.js");
const Subscription = require("../models/Subscription.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");

const blogController = {};

const calculateBlogCount = async (userId) => {
  const blogCount = await Blog.countDocuments({
    author: userId,
    isDeleted: false,
  });
  await User.findByIdAndUpdate(userId, { blogCount });
};
blogController.createNewBlog = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const expiredSubscription = await Subscription.findOne({
    buyerId: currentUserId,
    expiredDate: { $lte: Date.now() },
  });
  if (expiredSubscription) {
    await User.findByIdAndUpdate(currentUserId, { role: "reader" });
    await Subscription.findOneAndDelete({ buyerId: currentUserId });
    throw new AppError(401, "Expired Subscription", "Create Blog Error");
  }
  const checkWriter = await User.findById(currentUserId);
  if (checkWriter.role !== "writer") {
    throw new AppError(
      401,
      "Only Subscription can write blog",
      "Create Blog Error"
    );
  }
  const {
    content,
    title,

    coverImage,
    status,
    isAllowComment,
    isAllowReaction,
  } = req.body;

  let blog = await Blog.create({
    title,

    content,
    coverImage,
    status,
    isAllowComment,
    isAllowReaction,
    author: currentUserId,
  });
  await calculateBlogCount(currentUserId);
  blog = await blog.populate("author");

  return sendResponse(
    res,
    200,
    true,
    blog,
    null,
    "Create new Blog successfully"
  );
});

blogController.updateBlog = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const blogId = req.params.id;

  let blog = await Blog.findById(blogId);
  if (!blog) throw new AppError(400, "Blog not found", "Update Blog Error");
  if (!blog.author.equals(currentUserId))
    throw new AppError(400, "Only author can edit Blog", "Update Blog Error");

  const allows = [
    "title",
    "coverImage",
    "content",
    "status",
    "isAllowComment",
    "isAllowReaction",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      blog[field] = req.body[field];
    }
  });
  await blog.save();

  return sendResponse(res, 200, true, blog, null, "Update Blog successful");
});

blogController.getSingleBlog = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { slug } = req.params;

  let blog = await Blog.findOne({ slug }).populate("author");
  if (!blog) throw new AppError(400, "Blog not found", "Get Single Blog Error");

  // blog = blog.toJSON();
  // blog.comments = await Comment.find({ blog: blog._id }).populate("author");

  return sendResponse(res, 200, true, blog, null, "Get Single Blog successful");
});

blogController.deleteSingleBlog = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const blogId = req.params.id;

  const blog = await Blog.findOneAndUpdate(
    { _id: blogId, author: currentUserId },
    { isDeleted: true },
    { new: true }
  );

  if (!blog)
    throw new AppError(
      400,
      "Blog not found or User not authorized",
      "Delete Blog Error"
    );
  await calculateBlogCount(currentUserId);

  return sendResponse(res, 200, true, blog, null, "Delete Blog successful");
});

blogController.getAllBlogsOfUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;
  let { page, limit, ...filter } = { ...req.query };

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get Blogs Error");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }, { author: userId }];
  if (filter.title) {
    filterConditions.push({
      ["title"]: { $regex: filter.title, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Blog.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let blogs = await Blog.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  sendResponse(res, 200, true, { blogs, totalPages, count }, null, "");
});

blogController.getPublishedBlogsOfUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;
  let { page, limit, ...filter } = { ...req.query };

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get Blogs Error");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [
    { isDeleted: false },
    { author: userId },
    { status: "published" },
  ];
  if (filter.title) {
    filterConditions.push({
      ["title"]: { $regex: filter.title, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Blog.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let blogs = await Blog.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  sendResponse(res, 200, true, { blogs, totalPages, count }, null, "");
});

blogController.getBlogs = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;
  let { page, limit, ...filter } = { ...req.query };

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get Posts Error");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let userFollowIDs = await Follow.find({
    followerId: userId,
  });
  let filterConditions = [];
  if (userFollowIDs && userFollowIDs.length) {
    userFollowIDs = userFollowIDs.map((follow) => {
      if (follow.followerId._id.equals(userId)) return follow.followingId;
    });
    userFollowIDs = [...userFollowIDs, userId];
    filterConditions = [
      { isDeleted: false },
      { author: { $in: userFollowIDs } },
      { status: "published" },
    ];
  } else {
    filterConditions = [{ isDeleted: false }, { status: "published" }];
  }
  if (filter.title) {
    filterConditions.push({
      ["title"]: { $regex: filter.title, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Blog.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let blogs = await Blog.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  sendResponse(res, 200, true, { blogs, totalPages, count }, null, "");
});

blogController.getCommentsOfBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Validate blog exists
  const blog = Blog.findById(blogId);
  if (!blog) throw new AppError(400, "Blog not found", "Get Comments Error");
  // Get comments
  const count = await Comment.countDocuments({ blogId: blogId });
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const comments = await Comment.find({ blogId: blogId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");
  return sendResponse(
    res,
    200,
    true,
    { comments, totalPages, count },
    null,
    "Get comments successful"
  );
});

module.exports = blogController;
