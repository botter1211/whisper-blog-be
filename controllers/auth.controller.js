const User = require("../models/User.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const bcrypt = require("bcryptjs");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // Get data from request
  const { email, password } = req.body;
  // Business Logic Validation
  const user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");
  // Process
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");
  const accessToken = await user.generateToken();
  // Response
  sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
});

authController.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const userId = req.params.id;
  let { passwordCurrent, password } = req.body;

  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError(400, "User not found", "Update User Error");

  // Check if current password is correct
  if (!(await bcrypt.compare(passwordCurrent, user.password))) {
    throw new AppError(401, "Your current password is wrong.", "Update Error");
  }
  // If so, update password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  user.password = password;

  await user.save();

  sendResponse(res, 200, true, user, null, "Change Password successful");
});

authController.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  let { email, citizenId, password } = req.body;

  const existsUser = await User.findOne({ email });
  if (!existsUser)
    throw new AppError(400, "Email not found", "Recover Password Error");

  // Check if current password is correct
  if (citizenId !== existsUser.citizenId) {
    throw new AppError(
      401,
      "Your citizen ID is wrong or not found.",
      "Update Error"
    );
  }

  // If so, update password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  existsUser.password = password;

  await existsUser.save();

  sendResponse(
    res,
    200,
    true,
    { user: existsUser },
    null,
    "Recover Password successful"
  );
});
module.exports = authController;
