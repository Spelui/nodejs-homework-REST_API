const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');

const userModel = require('../models/user.model');
const { serializeUser, serializeUserLogIn } = require('../utils/serializeUser');
const sendMailSendDGrid = require('../utils/sendMail');

const getCurrentUser = async (req, res, next) => {
  const user = await userModel.findOne({ token: req.user.token });

  if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  return res.status(201).json(serializeUser(user));
};

const signUpUser = async (req, res, next) => {
  const { email, password } = req.body;
  const isUserExist = await userModel.findOne({ email });

  if (isUserExist) {
    return res.status(409).json({ message: 'Email in use' });
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  const hashingPassword = await bcrypt.hash(password, 8);
  const user = await userModel.create({
    email,
    password: hashingPassword,
    avatarURL,
    verificationToken,
  });

  sendMailSendDGrid(email, verificationToken);

  return res.status(201).json(serializeUser(user));
};

const signInUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }
  if (user.verify === false) {
    return res
      .status(401)
      .json({ message: 'You must confirm your email to log in' });
  }
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

  await userModel.findByIdAndUpdate(user._id, { token });

  return res.status(200).json(serializeUserLogIn(user, token));
};

const logOutUser = async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    token: null,
  });

  return res.status(204).json({ message: '' });
};

const patchSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const isValidReq = ['starter', 'pro', 'business'].includes(
    req.body.subscription
  );
  if (!isValidReq) {
    return res.status(400).json({
      message: 'Subscription can be only like this: starter, pro, business',
    });
  }

  await userModel.findByIdAndUpdate(_id, {
    subscription: req.body.subscription,
  });
  return res
    .status(200)
    .json({ message: `Subscription changed on ${req.body.subscription}` });
};

const publicDir = path.resolve(process.cwd(), 'public/avatars');

const patchUserAvatar = async (req, res) => {
  const { _id: userId } = req.user;
  const { path: pathFile, filename } = req.file;
  const newFileName = `${userId}-${filename}`;
  const newFilePath = path.join(publicDir, newFileName);

  await Jimp.read(pathFile)
    .then((image) => {
      image.resize(250, 250);
      image.write(pathFile);
    })
    .catch((err) => {
      return new Error(err.message);
    });

  try {
    await fs.rename(pathFile, newFilePath);
  } catch (err) {
    await fs.unlink(pathFile);
    return new Error('Somesing went wrong!');
  }

  await userModel.findOneAndUpdate(userId, {
    $set: { avatarURL: newFilePath },
  });

  res.status(200).json({ avatarURL: newFilePath });
};

const verifyController = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const user = await userModel.findOne({ email });

  if (user.verify === true) {
    return res
      .status(400)
      .json({ message: 'Verification has already been passed' });
  }

  sendMailSendDGrid(email, user.verificationToken);
  res.status(200).json({ message: 'Verification email sent' });
};

const verificationTokenController = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;

  const user = await userModel.findOne({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: 'Not found' });
  }

  user.verificationToken = 'null';
  user.verify = true;

  await user.save();

  res.status(200).json({ message: 'Verification successful' });
};

module.exports = {
  verificationTokenController,
  verifyController,
  getCurrentUser,
  patchSubscription,
  signInUser,
  signUpUser,
  logOutUser,
  patchUserAvatar,
};
