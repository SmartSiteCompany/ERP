const express = require('express');
const gastoController = require('../controllers/gastoController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware.authenticateToken, gastoController.createGasto);
router.get('/', authMiddleware.authenticateToken, gastoController.getGastos);

module.exports = router;
