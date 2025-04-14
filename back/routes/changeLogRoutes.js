// src/routes/changeLogRoutes.js
const express = require('express');
const router = express.Router();
const changeLogController = require('../controllers/changeLogController');

router.get('/', changeLogController.obtenerChangeLogs);
router.get('/:id', changeLogController.obtenerChangeLogPorId);
router.post('/', changeLogController.crearChangeLog);
router.put('/:id', changeLogController.actualizarChangeLog);
router.delete('/:id', changeLogController.eliminarChangeLog);

module.exports = router;