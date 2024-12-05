const express = require('express');
const cors = require('cors');
const connectdb = require('./src/config/config');
require('dotenv').config();

connectdb();
const apiRoutes = require('./src/routes/index.route');
const errorHandler = require('./src/utils/error.handler');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api",apiRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});