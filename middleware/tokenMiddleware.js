const jwt = require("jsonwebtoken");
const userModel = require("../db/userModel");

const tokenMiddleware = async (req, res, next) => {
  try {
    const [token] = req.headers.authorization.split(" ");
    const { _id } = jwt.decode(token, process.env.SECRET_KEY);
    const user = await userModel.findById(_id);
    if (!user || user.token !== token) {
      next(res.status(401).json({ message: "Not authorized" }));
    }
    req.user = user;

    next();
  } catch (error) {
    next(res.status(401).json({ message: "Not authorized" }));
  }
};

module.exports = { tokenMiddleware };
