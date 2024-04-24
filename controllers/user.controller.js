const User = require("../models/User.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const bcrypt = require("bcryptjs");
const Follow = require("../models/Follow.js");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  // Get data from request
  let { name, email, password, citizenId } = req.body;
  // Validation
  let user = await User.findOne({ email });
  if (user)
    throw new AppError(400, "User already exists", "Registration Error");
  // Process
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ name, email, password, citizenId });

  const accessToken = await user.generateToken();
  // Response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User successful"
  );
});

userController.getUsers = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let { page, limit, ...filter } = { ...req.query };

  let followingList = await Follow.find({
    followerId: currentUserId,
  });

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }];

  if (filter.name) {
    filterConditions.push({
      name: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
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
  sendResponse(
    res,
    200,
    true,
    { users: usersFollow, totalPages, count },
    null,
    ""
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Current User successful"
  );
});

userController.getSingleUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { slug } = req.params;

  let user = await User.findOne({ slug });
  if (!user) throw new AppError(400, "User not found", "Get Single User Error");
  user = user.toJSON();
  user.follow = await Follow.findOne({
    followerId: currentUserId,
    followingId: user._id,
  });

  return sendResponse(res, 200, true, user, null, "Get Single User successful");
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.id;

  if (currentUserId !== userId)
    throw new AppError(400, "Permission required", "Update User Error");

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Update User Error");

  const allows = [
    "name",
    "citizenId",
    "avatarUrl",
    "aboutMe",
    "facebookLink",
    "instagramLink",
    "githubLink",
    "xLink",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();

  return sendResponse(res, 200, true, user, null, "Update User successful");
});

module.exports = userController;
