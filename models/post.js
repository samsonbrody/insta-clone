const mongoose = require("mongoose");
const Comment = require("./comment");
const PostSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  caption: String,
  likes: Number,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
