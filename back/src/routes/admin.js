// src/routes/admin.js
const express = require('express');
const { createTaskHandler, getTasksHandler, updateTaskHandler } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/tasks', authMiddleware.authenticateToken, createTaskHandler);
router.get('/tasks', authMiddleware.authenticateToken, getTasksHandler);
router.put('/tasks/:id', authMiddleware.authenticateToken, updateTaskHandler);
//router.delete('/tasks/:id', authMiddleware.authenticateToken, deleteTaskHandler);

module.exports = router;