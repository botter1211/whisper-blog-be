var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "ok", data: "hello" });
});

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// blogApi
const blogApi = require("./blog.api");
router.use("/blogs", blogApi);

// followApi
const followApi = require("./follow.api");
router.use("/follows", followApi);

// commentApi
const commentApi = require("./comment.api");
router.use("/comments", commentApi);

// reactionApi
const reactionApi = require("./reaction.api");
router.use("/reactions", reactionApi);

// subscriptionApi
const subscriptionApi = require("./subscription.api");
router.use("/subscriptions", subscriptionApi);

module.exports = router;
