const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.postNewComment = async (req, res, next) => {
  const { id } = req.params;
  const { body, username } = req.body.comment;
  const post = await Post.findById(id);
  const comment = new Comment({ body, username });
  comment.author = req.user._id;
  post.comments.push(comment);
  await post.save();
  await comment.save();
  req.flash("success", "comment has been posted! nice!");
  res.redirect(`/posts/${post._id}`);
};

module.exports.deleteComment = async (req, res, next) => {
  const { id, commentId } = req.params;
  await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "comment has been successfully deleted, lesgetitttt");
  res.redirect(`/posts/${id}`);
};
