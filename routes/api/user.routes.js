const express = require("express");
const userRouter = express.Router();

const {
  signUpUser,
  signInUser,
  getCurrentUser,
  patchSubscription,
  logOutUser,
} = require("../../controller/user.controller");
const { tokenMiddleware } = require("../../middleware/tokenMiddleware");
const { signUpValidate, signInValidate } = require("../../middleware/validate");
const asyncWrapper = require("../../utils/asyncWrapper");

userRouter.get("/current", tokenMiddleware, asyncWrapper(getCurrentUser));

userRouter.post("/register", signUpValidate, asyncWrapper(signUpUser));

userRouter.post("/login", signInValidate, asyncWrapper(signInUser));

userRouter.post("/logout", tokenMiddleware, asyncWrapper(logOutUser));

userRouter.patch("/", tokenMiddleware, asyncWrapper(patchSubscription));

module.exports = userRouter;
