const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const {ERROR_MESSAGES,STATUS_CODES,SUCCESS_MESSAGES} = require("../../src/utils/constants.js");
const Response = require("../../src/utils/response.js");
const {loginSchema,userSignUpSchema} = require("../../src/middleware/joi.validation.js");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const { value, error } = userSignUpSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      const existinguserByEmail = await User.findOne({ email: value.email });
      if (existinguserByEmail) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.EMAIL_EXIST,
          STATUS_CODES.BAD_REQUEST
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(value.password, salt);
      value.password = hashedPassword;
      const newuser = new User(value);
      await newuser.save();
      const token = jwt.sign(
        { id: newuser._id, email: newuser.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      newuser.token = token;
      await newuser.save();
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.USER_REGISTER,
        newuser
      );
    } catch (error) {
      return Response.errorResponseWithoutData(
        res,
        error.message,
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  },
  
  login: async (req, res, next) => {
    try {
      const { value, error } = loginSchema.validate(req.body);
      if (error) return Response.joiErrorResponseData(res, error);
      const { email, password } = value;
      let user = await User.findOne({ email: email });
      if (!user) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.EMAIL_NOT_FOUND,
          STATUS_CODES.BAD_REQUEST
        );
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.PASSWORD_INVALID,
          STATUS_CODES.BAD_REQUEST
        );
      }
      return Response.successResponseData(
        res,
        SUCCESS_MESSAGES.USER_LOGIN,
        user
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
