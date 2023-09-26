const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'Owner', 'Manager').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid('Admin', 'Owner', 'Manager'),
  is_archived: Joi.boolean(),
}).or('name', 'email', 'password', 'role', 'is_archived');

module.exports = { signupSchema, loginSchema, updateUserSchema };
