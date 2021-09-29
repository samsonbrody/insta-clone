const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Comment = require("../models/comment");
const Post = require("../models/post");
const ExpressError = require("../utils/ExpressError");
const { commentSchema } = require("../schemas");
const { validateComment, isCommentAuthor } = require("../middleware");
const comment = require("../controllers/comments");

router.post("/", validateComment, wrapAsync(comment.postNewComment));

router.delete("/:commentId", isCommentAuthor, wrapAsync(comment.deleteComment));

module.exports = router;
