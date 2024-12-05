const Task = require("../models/Task");
const { STATUS_CODES, SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../utils/constants");
const Response = require("../utils/response");
const {
  addTaskSchema,
  taskQuerySchema,
  taskIdSchema
} = require("../middleware/joi.validation");

module.exports = {
  createTask: async (req, res, next) => {
    try {
      console.log("req user--",req.user);
      const { value, error } = addTaskSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);

      const taskExist = await Task.findOne({ 
        title: value.title, 
        user: req.user._id 
      });
      
      if (taskExist) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.TASK_EXIST,
          STATUS_CODES.CONFLICT
        );
      }

      const task = new Task({
        ...value,
        user: req.user._id
      });
      await task.save();

      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.TASK_ADDED,
        task
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  getTasks: async (req, res, next) => {
    try {
      const { value, error } = taskQuerySchema.validate(req.query);
      if (error) return Response.joiErrorResponseData(res, error);

      const { 
        status, 
        page = 1, 
        limit = 10 
      } = value;

      const query = { user: req.user._id };
      if (status) query.status = status;

      const tasks = await Task.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await Task.countDocuments(query);

      return Response.successResponseData(res, SUCCESS_MESSAGES.TASKS_FETCHED, {
        tasks,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  editTask: async (req, res, next) => {
    try {
      const { error: idError } = taskIdSchema.validate({ id: req.params.id });
      if (idError) return Response.joiErrorResponseData(res, idError);

      const task = await Task.findOne({ 
        _id: req.params.id, 
        user: req.user.id 
      });

      if (!task) {
        return Response.errorResponseWithoutData(
          res,
          SUCCESS_MESSAGES.TASK_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.TASK_EDIT,
        task
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  updateTask: async (req, res, next) => {
    try {
      const { error: idError } = taskIdSchema.validate({ id: req.params.id });
      if (idError) return Response.joiErrorResponseData(res, idError);

      const task = await Task.findOne({ 
        _id: req.params.id, 
        user: req.user.id 
      });

      if (!task) {
        return Response.errorResponseWithoutData(
          res,
          SUCCESS_MESSAGES.TASK_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }

      if (req.body.title && req.body.title !== task.title) {
        const taskExist = await Task.findOne({ 
          title: req.body.title, 
          user: req.user.id 
        });
        
        if (taskExist) {
          return Response.errorResponseWithoutData(
            res,
            SUCCESS_MESSAGES.TASK_EXIST,
            STATUS_CODES.CONFLICT
          );
        }
      }
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { 
          ...req.body, 
          updatedAt: Date.now() 
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.TASK_UPDATED,
        updatedTask
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  deleteTask: async (req, res, next) => {
    try {
      const { error } = taskIdSchema.validate({ id: req.params.id });
      if (error) return Response.joiErrorResponseData(res, error);

      const task = await Task.findOneAndDelete({ 
        _id: req.params.id, 
        user: req.user._id 
      });

      if (!task) {
        return Response.errorResponseWithoutData(
          res,
          SUCCESS_MESSAGES.TASK_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }

      return Response.successResponseWithoutData(
        res,
        SUCCESS_MESSAGES.TASK_DELETED
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }
};