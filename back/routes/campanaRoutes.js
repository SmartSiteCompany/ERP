// src/routes/campanaRoutes.js
const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campanaController');

router.get('/', campaignController.obtenerCampaigns);
router.get('/:id', campaignController.obtenerCampaignPorId);
router.post('/', campaignController.crearCampaign);
router.put('/:id', campaignController.actualizarCampaign);
router.delete('/:id', campaignController.eliminarCampaign);

module.exports = router;