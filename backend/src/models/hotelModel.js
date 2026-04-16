// =============================================
// Modelo: Hoteles
// =============================================
const db = require('../config/db');

const Hotel = {
    // Obtener todos los hoteles
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM hoteles');
        return rows;
    },

    // Obtener hotel por ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM hoteles WHERE id = ?', [id]);
        return rows[0];
    },

    // Crear un nuevo hotel
    create: async (data) => {
        const { nombre, direccion, estrellas, telefono } = data;
        const [result] = await db.query(
            'INSERT INTO hoteles (nombre, direccion, estrellas, telefono) VALUES (?, ?, ?, ?)',
            [nombre, direccion, estrellas, telefono]
        );
        return { id: result.insertId, ...data };
    },

    // Actualizar un hotel existente
    update: async (id, data) => {
        const { nombre, direccion, estrellas, telefono } = data;
        const [result] = await db.query(
            'UPDATE hoteles SET nombre = ?, direccion = ?, estrellas = ?, telefono = ? WHERE id = ?',
            [nombre, direccion, estrellas, telefono, id]
        );
        return result.affectedRows > 0;
    },

    // Eliminar un hotel
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM hoteles WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Hotel;
