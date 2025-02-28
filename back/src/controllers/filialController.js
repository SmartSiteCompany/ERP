const Filial = require('../models/Filial');

exports.createFilial = async (req, res) => {
  try {
    const nuevaFilial = new Filial(req.body);
    await nuevaFilial.save();
    res.status(201).json({ message: 'Filial creada exitosamente', filial: nuevaFilial });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear filial', details: error.message });
  }
};

exports.getFiliales = async (req, res) => {
  try {
    const filiales = await Filial.find();
    res.status(200).json(filiales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener filiales', details: error.message });
  }
};
