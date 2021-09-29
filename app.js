if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Joi = require("joi");
const ExpressError = require("./utils/ExpressError");
const { postSchema } = require("./schemas");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/user");
const wrapAsync = require("./utils/wrapAsync");
const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/insta-clone";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind("connection error"));
db.once("open", () => {
  console.log("database connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// VIEW ENGINE MIDDLEWARES
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const secret = process.env.SECRET || "greatsecret";

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("session store error", e);
});
// Session Options
const sessionOptions = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
// Session and Flash MiddleWares:
app.use(session(sessionOptions));
app.use(flash());
// Passport MiddleWares:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// Serialize user initiates a user into the session, deserialize takes the user out of the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MiddleWares for flash messages
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// MAIN ROUTES CONNECTION MIDDLEWARE:
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("user/login");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "oh no!!!!";
  res.status(statusCode).render("error", { err });
});

app.listen(8080, () => {
  console.log("listening at port 8080! :)");
});
