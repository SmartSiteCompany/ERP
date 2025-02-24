// services/taskServices
const Task = require('../models/Task');

const createTask = async (data) => {
  try {
      if (!data.title || !data.description || !data.assignedTo) {
          throw new Error('Todos los campos son obligatorios');
      }
      const task = new Task(data);
      return await task.save();
  } catch (error) {
      throw new Error(error.message || 'Error al crear la tarea');
  }
};


const getTasks = async (userId, userRole) => {
  try {
      if (userRole === 'admin') {
          return await Task.find().populate('assignedTo'); // 🔹 Si es admin, obtiene todas las tareas
      } else {
          return await Task.find({ assignedTo: userId }).populate('assignedTo'); // 🔹 Si no, obtiene solo sus tareas
      }
  } catch (error) {
      throw new Error('Error al obtener las tareas');
  }
};


module.exports = { createTask, getTasks };