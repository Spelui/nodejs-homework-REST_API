const Joi = require("joi");

const postValidate = (req, res, next) => {
  const contactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(6).max(15).required(),
    favorite: Joi.boolean(),
  });

  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }
  next();
};

const updateValidate = (req, res, next) => {
  const contactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().min(4).max(60).email(),
    phone: Joi.string().min(6).max(15),
    favorite: Joi.boolean(),
  });

  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }
  next();
};

const signUpValidate = (req, res, next) => {
  const userSchema = Joi.object({
    email: Joi.string().min(6).max(60).email().required(),
    password: Joi.string().min(8).required(),
    subscription: Joi.string()
      .valid("starter", "pro", "business")
      .default("starter"),
  });

  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }
  next();
};

const signInValidate = (req, res, next) => {
  const userSchema = Joi.object({
    email: Joi.string().min(6).max(60).email().required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  next();
};

module.exports = {
  postValidate,
  updateValidate,
  signUpValidate,
  signInValidate,
};
