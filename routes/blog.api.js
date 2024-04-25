const express = require("express");
const blogController = require("../controllers/blog.controller");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
const { param, body } = require("express-validator");
const router = express.Router();

/**
 * @route POST /blogs
 * @description Create a new blog
 * @access login required
 * @body {title, content, coverImage, isAllowComment, isAllowReaction}
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("content", "Missing content").exists().notEmpty(),
    body("title", "Missing content").exists().notEmpty(),
    body("status", "Invalid status").exists().isIn(["draft", "published"]),
    body("isAllowComment", "Invalid").exists().isBoolean(),
    body("isAllowReaction", "Invalid").exists().isBoolean(),
  ]),
  blogController.createNewBlog
);

/**
 * @route PUT /blogs
 * @description Update blog
 * @access login required
 * @body {title, content, coverImage, isAllowComment, isAllowReaction}
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
    body("title", "Missing content").exists().notEmpty(),
    body("status", "Invalid status").exists().isIn(["draft", "published"]),
    body("isAllowComment", "Invalid").exists().isBoolean(),
    body("isAllowReaction", "Invalid").exists().isBoolean(),
  ]),
  blogController.updateBlog
);

/**
 * @route PUT /blogs
 * @description Update blog
 * @access login required
 * @body {title, content, coverImage, isAllowComment, isAllowReaction}
 */
router.get(
  "/:slug",
  authentication.loginRequired,
  validators.validate([param("slug").exists().isString(), ,]),
  blogController.getSingleBlog
);

/**
 * @route DELETE /blogs/:id
 * @description Delete a blog
 * @access login required
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  blogController.deleteSingleBlog
);

/**
 * @route GET /blogs/user/userId?page=1&limit=10
 * @description Get all blogs of user with pagination
 * @access login required
 */
router.get(
  "/user/:userId",
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  blogController.getAllBlogsOfUser
);

/**
 * @route GET /blogs/published/user/userId?page=1&limit=10
 * @description Get published blogs of user with pagination
 * @access login required
 */
router.get(
  "/published/user/:userId",
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  blogController.getPublishedBlogsOfUser
);

/**
 * @route GET /blogs/home/user/userId?page=1&limit=10
 * @description Get published blogs of user with pagination
 * @access login required
 */
router.get(
  "/home/user/:userId",
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  blogController.getBlogs
);

/**
 * @route GET /blogs/:id/comments
 * @description Get comments of a blog
 * @access login required
 */
router.get(
  "/:id/comments",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  blogController.getCommentsOfBlog
);

/**
 * @route GET /blogs
 * @description Get blogs for guest

 */
router.get("/", blogController.getAllBlogsForGuest);
module.exports = router;
