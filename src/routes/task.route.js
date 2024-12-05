const express = require('express');
const taskRoute = express.Router();
const taskController = require('../controller/task.controller');
const userAuth = require('../middleware/user.auth');

taskRoute.post('/create',userAuth,taskController.createTask);
taskRoute.get('/all',userAuth,taskController.getTasks);
taskRoute.get('/edit/:id',userAuth,taskController.editTask);
taskRoute.post('/update/:id',userAuth,taskController.updateTask);
taskRoute.get('/delete/:id',userAuth,taskController.deleteTask);

module.exports = taskRoute;