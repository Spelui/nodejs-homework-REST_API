const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../db/userModel");
const { serializeUser, serializeUserLogIn } = require("./serializeUser");

const getCurrentUser = async (req, res, next) => {
  const user = await userModel.findOne({ token: req.user.token });

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  return res.status(201).json(serializeUser(user));
};

const signUpUser = async (req, res, next) => {
  const { email, password } = req.body;
  const isUserExist = await userModel.findOne({ email });

  if (isUserExist) {
    return res.status(409).json({ message: "Email in use" });
  }

  const hashingPassword = await bcrypt.hash(password, 8);
  const user = await userModel.create({
    email,
    password: hashingPassword,
  });

  return res.status(201).json(serializeUser(user));
};

const signInUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

  await userModel.findByIdAndUpdate(user._id, { token });

  return res.status(200).json(serializeUserLogIn(user, token));
};

const logOutUser = async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    token: null,
  });

  return res.status(204).json({ message: "" });
};

const patchSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const isValidReq = ["starter", "pro", "business"].includes(
    req.body.subscription
  );
  if (!isValidReq) {
    return res.status(400).json({
      message: "Subscription can be only like this: starter, pro, business",
    });
  }

  await userModel.findByIdAndUpdate(_id, {
    subscription: req.body.subscription,
  });
  return res
    .status(200)
    .json({ message: `Subscription changed on ${req.body.subscription}` });
};

module.exports = {
  getCurrentUser,
  patchSubscription,
  signInUser,
  signUpUser,
  logOutUser,
};
