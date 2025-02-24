// controllers/adminController.js
const { createTask, getTasks } = require('../services/taskService');

const createTaskHandler = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título de la tarea es obligatorio' });
    }

    const task = await createTask({ title, description, assignedTo, status, priority, dueDate });
    res.status(201).json({ message: 'Tarea creada con éxito', task });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea', details: error.message });
  }
};

const getTasksHandler = async (req, res) => {
  try {
    const tasks = await getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas', details: error.message });
  }
};

module.exports = { createTaskHandler, getTasksHandler };
