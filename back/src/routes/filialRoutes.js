const express = require('express');
const filialController = require('../controllers/filialController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware.authenticateToken, filialController.createFilial);
router.get('/', authMiddleware.authenticateToken, filialController.getFiliales);

module.exports = router;
