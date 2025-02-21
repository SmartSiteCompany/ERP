// services/taskServices
const Task = require('../models/Task');

const createTask = async (data) => {
  const task = new Task(data);
  return await task.save();
};

const getTasks = async () => {
  return await Task.find().populate('assignedTo');
};

module.exports = { createTask, getTasks };
