// =============================================
// Modelo: Clientes
// =============================================
const db = require('../config/db');

const Cliente = {
    // Obtener todos los clientes
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM clientes');
        return rows;
    },

    // Obtener cliente por ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
        return rows[0];
    },

    // Crear un nuevo cliente
    create: async (data) => {
        const { nombre, email, telefono } = data;
        const [result] = await db.query(
            'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
            [nombre, email, telefono]
        );
        return { id: result.insertId, ...data };
    },

    // Actualizar un cliente existente
    update: async (id, data) => {
        const { nombre, email, telefono } = data;
        const [result] = await db.query(
            'UPDATE clientes SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
            [nombre, email, telefono, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Cliente;
