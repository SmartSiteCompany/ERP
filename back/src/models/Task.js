const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // 🔹 Agregado índice
  status: { type: String, enum: ['Pendiente', 'En progreso', 'Completada'], default: 'Pendiente' },
  priority: { type: String, enum: ['Baja', 'Media', 'Alta'], default: 'Media' },
  dueDate: { type: Date },
  progress: { type: Number, min: 0, max: 100, default: 0 }, // 🔹 Nuevo campo para progreso de la tarea
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
