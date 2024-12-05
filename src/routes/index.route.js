const express = require('express');
const route = express.Router();
const authRoute = require('./auth.route');
const taskRoute = require('./task.route')

route.use('/auth',authRoute);
route.use('/task',taskRoute);

module.exports = route;