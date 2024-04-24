const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const slugify = require("slugify");

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    password: { type: String, required: true, select: false },
    citizenId: { type: String, required: false, default: "" },
    avatarUrl: { type: String, required: false, default: "" },
    aboutMe: { type: String, required: false, default: "" },
    facebookLink: { type: String, required: false, default: "" },
    instagramLink: { type: String, required: false, default: "" },
    githubLink: { type: String, required: false, default: "" },
    xLink: { type: String, required: false, default: "" },

    role: {
      type: String,
      enum: ["reader", "writer"],
      default: "reader",
      required: true,
    },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
    blogCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("email")) return next();
  const baseSlug = slugify(this.email, {
    lower: true,
    remove: /[~.@!+'"!:*]/g,
    replacement: "-",
    strict: true,
  });
  this.slug = baseSlug;
  next();
});

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
