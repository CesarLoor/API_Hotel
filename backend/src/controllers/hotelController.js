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
            const { nombre, direccion, estrellas, telefono } = req.body;

            // Validar campos obligatorios
            if (!nombre || !direccion) {
                return res.status(400).json({ 
                    error: 'Los campos nombre y direccion son obligatorios',
                    detalles: {
                        nombre: !nombre ? 'Falta el nombre' : null,
                        direccion: !direccion ? 'Falta la dirección' : null
                    }
                });
            }

            // Validar estrellas (opcional, pero si viene debe ser 1-5)
            if (estrellas !== undefined && (isNaN(estrellas) || estrellas < 1 || estrellas > 5)) {
                return res.status(400).json({ error: 'El campo estrellas debe ser un número entre 1 y 5' });
            }

            const nuevoHotel = await Hotel.create({
                nombre,
                direccion,
                estrellas: estrellas || null,
                telefono: telefono || null
            });

            res.status(201).json({
                mensaje: 'Hotel creado exitosamente',
                datos: nuevoHotel
            });
        } catch (error) {
            console.error('Error al crear hotel:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // PUT /api/hoteles/:id
    update: async (req, res) => {
        try {
            const { nombre, direccion, estrellas, telefono } = req.body;

            // Validar campos obligatorios
            if (!nombre || !direccion) {
                return res.status(400).json({ error: 'Los campos nombre y direccion son obligatorios' });
            }

            // Validar estrellas
            if (estrellas !== undefined && (isNaN(estrellas) || estrellas < 1 || estrellas > 5)) {
                return res.status(400).json({ error: 'El campo estrellas debe ser un número entre 1 y 5' });
            }

            // Verificar que el hotel exista
            const hotelExiste = await Hotel.getById(req.params.id);
            if (!hotelExiste) {
                return res.status(404).json({ error: 'Hotel no encontrado' });
            }

            const actualizado = await Hotel.update(req.params.id, {
                nombre,
                direccion,
                estrellas: estrellas || hotelExiste.estrellas,
                telefono: telefono || hotelExiste.telefono
            });

            if (actualizado) {
                const hotelActualizado = await Hotel.getById(req.params.id);
                res.status(200).json({
                    mensaje: 'Hotel actualizado exitosamente',
                    datos: hotelActualizado
                });
            } else {
                res.status(400).json({ error: 'No se realizaron cambios en el hotel' });
            }
        } catch (error) {
            console.error('Error al actualizar hotel:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // DELETE /api/hoteles/:id
    delete: async (req, res) => {
        try {
            // Verificar que el hotel exista
            const hotelExiste = await Hotel.getById(req.params.id);
            if (!hotelExiste) {
                return res.status(404).json({ error: 'Hotel no encontrado' });
            }

            await Hotel.delete(req.params.id);
            res.status(200).json({ mensaje: 'Hotel eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar hotel:', error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ error: 'No se puede eliminar el hotel porque tiene reservas asociadas' });
            }
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = hotelController;
