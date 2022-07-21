const express = require('express');
const userRouter = express.Router();

const {
  verifyController,
  verificationTokenController,
  signUpUser,
  signInUser,
  getCurrentUser,
  patchSubscription,
  patchUserAvatar,
  logOutUser,
} = require('../../controller/user.controller');
const { tokenMiddleware } = require('../../middleware/tokenMiddleware');
const { signUpValidate, signInValidate } = require('../../middleware/validate');
const asyncWrapper = require('../../utils/asyncWrapper');
const uploadFile = require('../../middleware/upload.file.middleware.js');

userRouter.post('/verify', asyncWrapper(verifyController));

userRouter.get(
  '/verify/:verificationToken',
  asyncWrapper(verificationTokenController)
);

userRouter.get('/current', tokenMiddleware, asyncWrapper(getCurrentUser));

userRouter.post('/register', signUpValidate, asyncWrapper(signUpUser));

userRouter.post('/login', signInValidate, asyncWrapper(signInUser));

userRouter.post('/logout', tokenMiddleware, asyncWrapper(logOutUser));

userRouter.patch('/', tokenMiddleware, asyncWrapper(patchSubscription));

userRouter.patch(
  '/avatar',
  tokenMiddleware,
  uploadFile.single('avatar'),
  asyncWrapper(patchUserAvatar)
);

module.exports = userRouter;
