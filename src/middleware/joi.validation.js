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

// Task Schemas
const addTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .default('pending')
});

const taskQuerySchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .optional(),
  page: Joi.number()
    .integer()
    .min(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
});

const taskIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid task ID'
    })
});

module.exports = {
  loginSchema,
  userSignUpSchema,
  addTaskSchema,
  taskQuerySchema,
  taskIdSchema
};
