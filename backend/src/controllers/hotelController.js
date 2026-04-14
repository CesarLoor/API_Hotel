// =============================================
// Controlador: Hoteles
// =============================================
const Hotel = require('../models/hotelModel');

const hotelController = {
    // GET /api/hoteles
    getAll: async (req, res) => {
        try {
            const hoteles = await Hotel.getAll();
            res.status(200).json(hoteles);
        } catch (error) {
            console.error('Error al obtener hoteles:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // GET /api/hoteles/:id
    getById: async (req, res) => {
        try {
            const hotel = await Hotel.getById(req.params.id);
            if (!hotel) {
                return res.status(404).json({ error: 'Hotel no encontrado' });
            }
            res.status(200).json(hotel);
        } catch (error) {
            console.error('Error al obtener hotel:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // POST /api/hoteles
    create: async (req, res) => {
        try {
            const { nombre, direccion } = req.body;

            // Validar campos obligatorios
            if (!nombre || !direccion) {
                return res.status(400).json({ error: 'Los campos nombre y direccion son obligatorios' });
            }

            const nuevoHotel = await Hotel.create(req.body);
            res.status(201).json(nuevoHotel);
        } catch (error) {
            console.error('Error al crear hotel:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // PUT /api/hoteles/:id
    update: async (req, res) => {
        try {
            const { nombre, direccion } = req.body;

            // Validar campos obligatorios
            if (!nombre || !direccion) {
                return res.status(400).json({ error: 'Los campos nombre y direccion son obligatorios' });
            }

            // Verificar que el hotel exista
            const hotelExiste = await Hotel.getById(req.params.id);
            if (!hotelExiste) {
                return res.status(404).json({ error: 'Hotel no encontrado' });
            }

            await Hotel.update(req.params.id, req.body);
            const hotelActualizado = await Hotel.getById(req.params.id);
            res.status(200).json(hotelActualizado);
        } catch (error) {
            console.error('Error al actualizar hotel:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = hotelController;
