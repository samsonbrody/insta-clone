const Post = require("../models/post");

module.exports.index = async (req, res, next) => {
  const posts = await Post.find({}).populate("author");
  res.render("posts/index", { posts });
};

module.exports.createNewPost = async (req, res, next) => {
  const post = new Post(req.body.post);
  // here the req.user._id is referring to the specific passport session user, the one who is making the current request.
  // the ~post.author~ is being set to whoever has been authenticated by passport.js. req.user is created by passport
  post.author = req.user._id;
  post.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  console.log(post);
  await post.save();
  req.flash("success", "Post successful! ayyyy");
  res.redirect(`/posts/${post.id}`);
};

module.exports.renderNewPostForm = (req, res) => {
  res.render("posts/new");
};

module.exports.showSpecificPost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id)
    .populate({
      path: "comments",
      populate: "author",
    })
    .populate("author");

  if (!post) {
    req.flash("error", "sorry cant find that page");
    return res.redirect("/posts");
  }

  res.render("posts/show", { post });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    req.flash("error", "sorry cant find that page");
    return res.redirect("/posts");
  }
  res.render("posts/edit", { post });
};

module.exports.deletePost = async (req, res, next) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  req.flash("success", "Post Delete Successful! ayyy");
  res.redirect("/posts");
};

module.exports.updatePost = async (req, res, next) => {
  const { id } = req.params;
  await Post.findByIdAndUpdate(id, { ...req.body.post });
  res.redirect(`/posts/${id}`);
};
