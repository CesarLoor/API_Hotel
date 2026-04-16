// =============================================
// Controlador: Reservas
// =============================================
const Reserva = require('../models/reservaModel');

const reservaController = {
    // GET /api/reservas
    getAll: async (req, res) => {
        try {
            const reservas = await Reserva.getAll();
            res.status(200).json(reservas);
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // GET /api/reservas/:id
    getById: async (req, res) => {
        try {
            const reserva = await Reserva.getById(req.params.id);
            if (!reserva) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }
            res.status(200).json(reserva);
        } catch (error) {
            console.error('Error al obtener reserva:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // POST /api/reservas
    create: async (req, res) => {
        try {
            const { fecha_entrada, fecha_salida, hotel_id, cliente_id } = req.body;

            // Validar campos obligatorios
            if (!fecha_entrada || !fecha_salida || !hotel_id || !cliente_id) {
                return res.status(400).json({
                    error: 'Los campos fecha_entrada, fecha_salida, hotel_id y cliente_id son obligatorios'
                });
            }

            const nuevaReserva = await Reserva.create(req.body);
            res.status(201).json(nuevaReserva);
        } catch (error) {
            // Error de FK: hotel o cliente no existe
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: 'El hotel_id o cliente_id proporcionado no existe' });
            }
            console.error('Error al crear reserva:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // PUT /api/reservas/:id
    update: async (req, res) => {
        try {
            const { fecha_entrada, fecha_salida, hotel_id, cliente_id } = req.body;

            // Validar campos obligatorios
            if (!fecha_entrada || !fecha_salida || !hotel_id || !cliente_id) {
                return res.status(400).json({
                    error: 'Los campos fecha_entrada, fecha_salida, hotel_id y cliente_id son obligatorios'
                });
            }

            // Verificar que la reserva exista
            const reservaExiste = await Reserva.getById(req.params.id);
            if (!reservaExiste) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }

            await Reserva.update(req.params.id, req.body);
            const reservaActualizada = await Reserva.getById(req.params.id);
            res.status(200).json(reservaActualizada);
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: 'El hotel_id o cliente_id proporcionado no existe' });
            }
            console.error('Error al actualizar reserva:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // DELETE /api/reservas/:id
    delete: async (req, res) => {
        try {
            // Verificar que la reserva exista
            const reservaExiste = await Reserva.getById(req.params.id);
            if (!reservaExiste) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }

            await Reserva.delete(req.params.id);
            res.status(200).json({ mensaje: 'Reserva eliminada exitosamente' });
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = reservaController;
