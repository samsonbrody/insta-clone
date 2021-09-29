const mongoose = require("mongoose");
const Post = require("../models/post");
mongoose.connect("mongodb://localhost:27017/insta-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind("connection error"));
db.once("open", () => {
  console.log("database connected");
});

const seedDB = async () => {
  const seed = new Post({
    title: "Back in the home state",
    author: "613953b36430e89df5e33570",
    imgUrl:
      "https://images.unsplash.com/photo-1534866640380-01f8a5cd587e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80",
    caption: "OREGON!!!!",
    likes: 5,
  });
  await seed.save();
};

seedDB();
