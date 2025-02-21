// models/Task
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pendiente', 'En progreso', 'Completada'], default: 'Pendiente' },
  priority: { type: String, enum: ['Bajo', 'Mediana', 'Alta'], default: 'Mediana' },
  dueDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
