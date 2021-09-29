const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { postSchema, commentSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const Post = require("../models/post");
const { isLoggedIn, isAuthor } = require("../middleware");
const { validatePost } = require("../middleware");
const posts = require("../controllers/posts");
// multer requirements so we can parse the form and accept img files
const multer = require("multer");
// requiring cloudinary configuration file in the posts routes page
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/", isLoggedIn, wrapAsync(posts.index));

router.get("/new", isLoggedIn, posts.renderNewPostForm);

router.post(
  "/",
  upload.array("image"),
  validatePost,
  wrapAsync(posts.createNewPost)
);

router.get("/:id", wrapAsync(posts.showSpecificPost));

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(posts.renderEditForm));

router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(posts.deletePost));

router.patch("/:id", validatePost, wrapAsync(posts.updatePost));

module.exports = router;
