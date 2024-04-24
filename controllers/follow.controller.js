const Follow = require("../models/Follow.js");
const User = require("../models/User.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");

const followController = {};

async function updateFollowerCount(userId) {
  const followerCount = await Follow.countDocuments({
    followingId: userId,
  });
  await User.findByIdAndUpdate(userId, { followerCount });
}

async function updateFollowingCount(userId) {
  const followingCount = await Follow.countDocuments({
    followerId: userId,
  });
  await User.findByIdAndUpdate(userId, { followingCount });
}

followController.createFollow = catchAsync(async (req, res, next) => {
  const followerId = req.userId;
  const followingId = req.body.followingId;

  const user = await User.findById(followingId);
  if (!user) throw new AppError(400, "User not found", "Create Follow Error");

  let followExists = await Follow.findOne({
    followingId: followingId,
    followerId: followerId,
  });
  if (followExists)
    throw new AppError(
      400,
      "You already follow this user",
      "Create Follow Error"
    );

  const follow = await Follow.create({
    followerId: followerId,
    followingId: followingId,
  });

  await updateFollowerCount(followingId);
  await updateFollowingCount(followerId);

  return sendResponse(
    res,
    200,
    true,
    follow,
    null,
    "Create Follow successfully"
  );
});

followController.unfollow = catchAsync(async (req, res, next) => {
  const followerId = req.userId;
  const followingId = req.params.followingId;

  const follow = await Follow.findOne({
    followerId: followerId,
    followingId: followingId,
  });
  if (!follow) throw new AppError(400, "Follow not found", "Unfollow Error");

  await Follow.deleteOne({ _id: follow._id });
  await updateFollowerCount(followingId);
  await updateFollowingCount(followerId);

  return sendResponse(res, 200, true, follow, null, "Unfollow successfully");
});

followController.getFollowingList = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  const currentUserId = req.userId;

  let followingList = await Follow.find({
    followerId: currentUserId,
  });

  const followingIDs = followingList.map((follow) => {
    if (follow.followerId._id.equals(currentUserId)) return follow.followingId;
  });

  const filterConditions = [{ _id: { $in: followingIDs } }];
  if (filter.name) {
    filterConditions.push({
      ["name"]: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const users = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  const usersFollow = users.map((user) => {
    let temp = user.toJSON();
    temp.follow = followingList.find((follow) => {
      if (follow.followingId.equals(user._id)) {
        return { status: "follow" };
      }
      return false;
    });
    return temp;
  });
  return sendResponse(
    res,
    200,
    true,
    { users: usersFollow, totalPages, count },
    null,
    null
  );
});

followController.getFollowerList = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  const currentUserId = req.userId;

  let followingList = await Follow.find({
    followerId: currentUserId,
  });

  let followerList = await Follow.find({
    followingId: currentUserId,
  });

  const followerIDs = followerList.map((follow) => {
    if (follow.followingId._id.equals(currentUserId)) return follow.followerId;
  });

  const filterConditions = [{ _id: { $in: followerIDs } }];
  if (filter.name) {
    filterConditions.push({
      ["name"]: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const users = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);
  const usersFollow = users.map((user) => {
    let temp = user.toJSON();
    temp.follow = followingList.find((follow) => {
      if (follow.followingId.equals(user._id)) {
        return { status: "follow" };
      }
      return false;
    });
    return temp;
  });
  return sendResponse(
    res,
    200,
    true,
    { users: usersFollow, totalPages, count },
    null,
    null
  );
});

module.exports = followController;
