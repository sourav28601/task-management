module.exports = {
  STATUS_CODES: {
    ACCESS_DENIED: 401,
    BAD_REQUEST: 400,
    OK: 200,
    INTERNAL_ERROR: 500,
    NOT_FOUND: 404,
    CONFLICT: 409
  },
  ACTIVE: "ACTIVE",

  SUCCESS_MESSAGES: {
    TASK_ADDED: 'Task added successfully',
    TASKS_FETCHED: 'Tasks retrieved successfully',
    TASK_EDIT: 'Get task data successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
    TASK_NOT_FOUND: 'Task not found',
    TASK_EXIST: 'Task with this title already exists',
    USER_LOGIN:"Login successfully",
    USER_REGISTER:"Register successfully"
  },

  ERROR_MESSAGES: {
    EMAIL_EXIST: 'Email alredy exist',
    TASK_EXIST: 'A task with this title already exists',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_REQUEST: 'Invalid request parameters'
  },

  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  }
};
