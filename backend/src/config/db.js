// =============================================
// Configuración de conexión a MySQL
// =============================================
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel_reservas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión al iniciar
pool.getConnection()
    .then(connection => {
        console.log(' Conexión exitosa a MySQL - Base de datos:', process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.error(' Error al conectar a MySQL:', err.message);
    });

module.exports = pool;
