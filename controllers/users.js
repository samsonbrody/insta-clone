const Post = require("../models/post");
const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("user/register");
};

module.exports.registerRequest = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash("success", `Welcome ${username}`);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
    });
    res.redirect("/posts");
  } catch (err) {
    req.flash("error", `${err.message}`);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login");
};

module.exports.loginRequest = (req, res, next) => {
  const redirectUrl = req.session.returnTo || "/posts";
  const { username } = req.body;
  delete req.session.returnTo;
  console.log(req.session);
  req.flash("success", `Welcome back ${username}`);
  res.redirect(redirectUrl);
};

module.exports.logoutRequest = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!!");
  res.redirect("/login");
};
