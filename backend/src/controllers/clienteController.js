// =============================================
// Controlador: Clientes
// =============================================
const Cliente = require('../models/clienteModel');

const clienteController = {
    // GET /api/clientes
    getAll: async (req, res) => {
        try {
            const clientes = await Cliente.getAll();
            res.status(200).json(clientes);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // GET /api/clientes/:id
    getById: async (req, res) => {
        try {
            const cliente = await Cliente.getById(req.params.id);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            res.status(200).json(cliente);
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // POST /api/clientes
    create: async (req, res) => {
        try {
            const { nombre, email } = req.body;

            // Validar campos obligatorios
            if (!nombre || !email) {
                return res.status(400).json({ error: 'Los campos nombre y email son obligatorios' });
            }

            const nuevoCliente = await Cliente.create(req.body);
            res.status(201).json(nuevoCliente);
        } catch (error) {
            // Error de email duplicado (MySQL error code 1062)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
            console.error('Error al crear cliente:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // PUT /api/clientes/:id
    update: async (req, res) => {
        try {
            const { nombre, email } = req.body;

            // Validar campos obligatorios
            if (!nombre || !email) {
                return res.status(400).json({ error: 'Los campos nombre y email son obligatorios' });
            }

            // Verificar que el cliente exista
            const clienteExiste = await Cliente.getById(req.params.id);
            if (!clienteExiste) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            await Cliente.update(req.params.id, req.body);
            const clienteActualizado = await Cliente.getById(req.params.id);
            res.status(200).json(clienteActualizado);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
            console.error('Error al actualizar cliente:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = clienteController;
