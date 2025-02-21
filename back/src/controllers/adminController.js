// controllers/adminController
const { createTask, getTasks } = require('../services/taskService');

const createTaskHandler = async (req, res) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

const getTasksHandler = async (req, res) => {
  try {
    const tasks = await getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks', error });
  }
};

module.exports = { createTaskHandler, getTasksHandler };
