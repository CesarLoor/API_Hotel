// =============================================
// Modelo: Reservas
// =============================================
const db = require('../config/db');

const Reserva = {
    // Obtener todas las reservas (con datos del hotel y cliente)
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT r.*, h.nombre AS hotel_nombre, c.nombre AS cliente_nombre
            FROM reservas r
            INNER JOIN hoteles h ON r.hotel_id = h.id
            INNER JOIN clientes c ON r.cliente_id = c.id
        `);
        return rows;
    },

    // Obtener reserva por ID (con datos del hotel y cliente)
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT r.*, h.nombre AS hotel_nombre, c.nombre AS cliente_nombre
            FROM reservas r
            INNER JOIN hoteles h ON r.hotel_id = h.id
            INNER JOIN clientes c ON r.cliente_id = c.id
            WHERE r.id = ?
        `, [id]);
        return rows[0];
    },

    // Crear una nueva reserva
    create: async (data) => {
        const { fecha_entrada, fecha_salida, num_huespedes, hotel_id, cliente_id } = data;
        const [result] = await db.query(
            'INSERT INTO reservas (fecha_entrada, fecha_salida, num_huespedes, hotel_id, cliente_id) VALUES (?, ?, ?, ?, ?)',
            [fecha_entrada, fecha_salida, num_huespedes || 1, hotel_id, cliente_id]
        );
        return { id: result.insertId, ...data };
    },

    // Actualizar una reserva existente
    update: async (id, data) => {
        const { fecha_entrada, fecha_salida, num_huespedes, hotel_id, cliente_id } = data;
        const [result] = await db.query(
            'UPDATE reservas SET fecha_entrada = ?, fecha_salida = ?, num_huespedes = ?, hotel_id = ?, cliente_id = ? WHERE id = ?',
            [fecha_entrada, fecha_salida, num_huespedes, hotel_id, cliente_id, id]
        );
        return result.affectedRows > 0;
    },

    // Eliminar una reserva
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM reservas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Reserva;
