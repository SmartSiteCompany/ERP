//routes/admin
const express = require('express');
const { createTaskHandler, getTasksHandler } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/tasks', authMiddleware, createTaskHandler);
router.get('/tasks', authMiddleware, getTasksHandler);

module.exports = router;
