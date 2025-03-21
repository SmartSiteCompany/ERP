const PDFDocument = require('pdfkit');
const { isValidObjectId } = require('mongoose');
const Cotizacion = require('../models/Cotizacion'); 
const ServicioFinanciado = require('../models/ServicioFinanciado');

/**
 * Genera un PDF que combina la información de una cotización y un servicio financiado.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

/**
 * @swagger
 * /api/generar-pdf/{cotizacionId}/{servicioId}:
 *   get:
 *     summary: Genera un PDF combinando una cotización y un servicio financiado.
 *     description: Obtiene los detalles de una cotización y un servicio financiado, y genera un PDF con la información combinada.
 *     parameters:
 *       - in: path
 *         name: cotizacionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cotización.
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio financiado.
 *     responses:
 *       200:
 *         description: PDF generado exitosamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en los parámetros de entrada (IDs no válidos o no pertenecen al mismo cliente).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Cotización o servicio no encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
const generarPDFCotizacionServicio = async (req, res) => {
  const { cotizacionId, servicioId } = req.params;

  // Validar que los IDs sean ObjectIds válidos
  if (!isValidObjectId(cotizacionId)) {
    return res.status(400).json({ message: 'ID de cotización no válido' });
  }
  if (!isValidObjectId(servicioId)) {
    return res.status(400).json({ message: 'ID de servicio no válido' });
  }

  try {
    // Obtener la cotización y el servicio financiado
    const cotizacion = await Cotizacion.findById(cotizacionId).populate('cliente_id');
    const servicio = await ServicioFinanciado.findById(servicioId).populate('cliente_id');

    // Validar que existan ambos documentos
    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    // Validar que pertenezcan al mismo cliente
    if (cotizacion.cliente_id._id.toString() !== servicio.cliente_id._id.toString()) {
      return res.status(400).json({ message: 'La cotización y el servicio no pertenecen al mismo cliente' });
    }

    // Crear el PDF
    const doc = new PDFDocument();
    const filename = `cotizacion_servicio_${cotizacion._id}_${servicio._id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    // Título del PDF
    doc.fontSize(25).text('Cotización y Servicio Financiado', { align: 'center' });
    doc.moveDown();

    // Información del cliente
    doc.fontSize(18).text('Información del Cliente', { underline: true });
    doc.fontSize(12).text(`Nombre: ${cotizacion.cliente_id.nombre}`);
    doc.text(`Email: ${cotizacion.cliente_id.email}`);
    doc.text(`Teléfono: ${cotizacion.cliente_id.telefono}`);
    doc.moveDown();

    // Detalles de la cotización
    doc.fontSize(18).text('Detalles de la Cotización', { underline: true });
    doc.fontSize(12).text(`Fecha de cotización: ${cotizacion.fecha_cotizacion.toLocaleDateString()}`);
    doc.text(`Forma de pago: ${cotizacion.forma_pago}`);
    doc.text(`Precio de venta: $${cotizacion.precio_venta}`);
    doc.text(`Anticipo solicitado: $${cotizacion.anticipo_solicitado}`);
    doc.text(`Filial: ${cotizacion.filial}`);
    doc.moveDown();

    // Detalles de los items de la cotización
    doc.fontSize(14).text('Items de la Cotización:');
    cotizacion.detalles.forEach((item, index) => {
      doc.fontSize(12).text(`Item ${index + 1}: ${item.descripcion}`);
      doc.text(`Costo de materiales: $${item.costo_materiales}`);
      doc.text(`Costo de mano de obra: $${item.costo_mano_obra}`);
      doc.text(`Inversión total: $${item.inversion}`);
      doc.text(`Utilidad esperada: $${item.utilidad_esperada}`);
      doc.moveDown();
    });

    // Detalles del servicio financiado
    doc.fontSize(18).text('Detalles del Servicio Financiado', { underline: true });
    doc.fontSize(12).text(`Descripción: ${servicio.descripcion}`);
    doc.text(`Monto del servicio: $${servicio.monto_servicio}`);
    doc.text(`Fecha de inicio: ${servicio.fecha_inicio.toLocaleDateString()}`);
    doc.text(`Fecha de término: ${servicio.fecha_termino ? servicio.fecha_termino.toLocaleDateString() : 'No especificada'}`);
    doc.text(`Pago semanal: $${servicio.pago_semanal}`);
    doc.text(`Saldo restante: $${servicio.saldo_restante}`);
    doc.moveDown();

    // Finalizar el PDF
    doc.end();
  } catch (error) {
    console.error('Error en generarPDFCotizacionServicio:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID no válido' });
    }

    res.status(500).json({ message: 'Error interno del servidor al generar el PDF' });
  }
};

module.exports = {
  generarPDFCotizacionServicio,
};