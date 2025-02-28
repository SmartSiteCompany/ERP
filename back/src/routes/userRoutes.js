const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware.authenticateToken, userController.getUsers);
router.delete('/:id', authMiddleware.authenticateToken, userController.deleteUser);

module.exports = router;
