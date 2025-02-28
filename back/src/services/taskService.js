// services/taskServices
const Task = require('../models/Task');

const createTask = async (data) => {
    try {
        console.log("🔹 Datos recibidos en createTask:", data);
  
        if (!data.title || !data.description) {
            throw new Error('El título y la descripción son obligatorios');
        }
  
        const task = new Task(data);
        const savedTask = await task.save();
  
        console.log("✅ Tarea guardada en BD:", savedTask);
        return savedTask;
    } catch (error) {
        console.error("❌ Error en createTask:", error.message);
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

const updateTask = async (taskId, updatedData) => {
    try {
        return await Task.findByIdAndUpdate(taskId, updatedData, { new: true });
    } catch (error) {
        throw new Error('Error al actualizar la tarea');
    }
};

module.exports = { createTask, getTasks, updateTask };
