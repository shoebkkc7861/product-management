import Joi from "joi";

export const signupSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dob: Joi.date().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required()
});

export const loginSchema = Joi.object({
  emailOrPhone: Joi.string().email().required(),
  password: Joi.string().required()
});
