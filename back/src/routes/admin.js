// routes/admin.js
const express = require('express');
const { createTaskHandler, getTasksHandler } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/tasks', authMiddleware.authenticateToken, createTaskHandler);
router.get('/tasks', authMiddleware.authenticateToken, getTasksHandler);

module.exports = router;