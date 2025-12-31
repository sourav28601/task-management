const Joi = require("joi");
const mongoose = require("mongoose");

// Authentication Schemas
const loginSchema = Joi.object({
  email: Joi.string().email().trim().min(1).max(255).required(),
  password: Joi.string().min(6).max(20).required(),
});
const userSignUpSchema = Joi.object({
  username: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().min(1).max(255).required(),
  password: Joi.string().min(6).max(20).required(),
});

module.exports = {
  loginSchema,
  userSignUpSchema
};
