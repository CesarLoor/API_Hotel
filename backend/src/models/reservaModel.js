// =============================================
// Modelo: Reservas
// =============================================
const db = require('../config/db');

/**
 * Normaliza cualquier formato de fecha a 'YYYY-MM-DD' para MySQL.
 * Acepta:
 *   '2026-05-01'                         → YYYY-MM-DD directo
 *   'Thu Apr 30 19:00:00 ECT 2026'       → formato toString() de JS
 *   ISO strings '2026-05-01T00:00:00Z'   → parse estándar
 *   Cualquier entrada inválida/ataque     → null (MySQL rechazará con 400)
 */
function toMysqlDate(value) {
    if (!value) return null;
    const str = String(value).trim();

    // 1) Ya es YYYY-MM-DD → OK directo
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

    // 2) Intentar parse estándar (funciona para ISO y muchos formatos comunes)
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const year  = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day   = String(d.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 3) Fallback regex para formato toString() de JS con timezone no estándar
    //    Ej: "Thu Apr 30 19:00:00 ECT 2026"  →  "Mon DD HH:MM:SS TZ YYYY"
    const MONTHS = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
    const m = str.match(/\b([A-Z][a-z]{2})\s+(\d{1,2})\s+\d{2}:\d{2}:\d{2}\s+\S+\s+(\d{4})\b/);
    if (m && MONTHS[m[1]]) {
        const year  = m[3];
        const month = String(MONTHS[m[1]]).padStart(2, '0');
        const day   = String(m[2]).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 4) Entrada inválida / payload de ataque → null  (el controlador devolverá 400)
    return null;
}

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
            [toMysqlDate(fecha_entrada), toMysqlDate(fecha_salida), num_huespedes || 1, hotel_id, cliente_id]
        );
        return { id: result.insertId, ...data };
    },

    // Actualizar una reserva existente
    update: async (id, data) => {
        const { fecha_entrada, fecha_salida, num_huespedes, hotel_id, cliente_id } = data;
        const [result] = await db.query(
            'UPDATE reservas SET fecha_entrada = ?, fecha_salida = ?, num_huespedes = ?, hotel_id = ?, cliente_id = ? WHERE id = ?',
            [toMysqlDate(fecha_entrada), toMysqlDate(fecha_salida), num_huespedes, hotel_id, cliente_id, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Reserva;
