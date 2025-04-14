// src/routes/documentoRoutes.js
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentoController');
const { uploadDoc } = require('../middlewares/upload');

router.get('/', documentController.obtenerDocumentos);
router.get('/:id', documentController.obtenerDocumentoPorId);
router.post('/', documentController.crearDocumento);
// Subir un nuevo documento
router.post('/upload', uploadDoc.single('archivo'), async (req, res) => {
    try {
      const { cliente_id, nombre, tipo } = req.body;  
      const nuevoDocumento = new Documento({
        cliente_id,
        nombre,
        tipo,
        archivo: req.file.path, // Ej: "uploads/documents/doc-987654321.pdf"
        tamaño: req.file.size, // Tamaño en bytes
        formato: req.file.mimetype, // Ej: "application/pdf"
      });
  
      await nuevoDocumento.save();
      res.status(201).json(nuevoDocumento);
    } catch (error) {
      res.status(500).json({ error: 'Error al subir el documento' });
    }
  });

router.put('/:id', documentController.actualizarDocumento);
router.delete('/:id', documentController.eliminarDocumento);
module.exports = router;