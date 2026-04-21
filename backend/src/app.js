// =============================================
// API REST - Gestión de Reservas de Hotel
// Laboratorio 2
// =============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Importar rutas
const hotelRoutes = require('./routes/hotelRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// Middlewares
// =============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================
// Spec JSON (debe ir ANTES del swagger-ui middleware)
// URL para OWASP ZAP: http://localhost:3000/api-docs/openapi.json
// =============================================
app.get('/api-docs/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// =============================================
// Swagger UI (documentación interactiva)
// Visita: http://localhost:3000/api-docs
// =============================================
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'API Hotel – Docs',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    })
);

// =============================================
// Rutas de la API
// =============================================
app.use('/api/hoteles', hotelRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);

// Ruta raíz - Información de la API
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API REST - Gestión de Reservas de Hotel',
        version: '1.0.0',
        docs: `http://localhost:${PORT}/api-docs`,
        openapi_spec: `http://localhost:${PORT}/api-docs/openapi.json`,
        endpoints: {
            hoteles: '/api/hoteles',
            clientes: '/api/clientes',
            reservas: '/api/reservas',
        },
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// =============================================
// Iniciar servidor
// =============================================
app.listen(PORT, () => {
    console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 Swagger UI:        http://localhost:${PORT}/api-docs`);
    console.log(`🔍 OpenAPI JSON:      http://localhost:${PORT}/api-docs/openapi.json`);
    console.log(`   (Usa esta URL en OWASP ZAP → Import → Import an OpenAPI definition)\n`);
    console.log(` Endpoints disponibles:`);
    console.log(`   GET/POST       http://localhost:${PORT}/api/hoteles`);
    console.log(`   GET/PUT        http://localhost:${PORT}/api/hoteles/:id`);
    console.log(`   GET/POST       http://localhost:${PORT}/api/clientes`);
    console.log(`   GET/PUT        http://localhost:${PORT}/api/clientes/:id`);
    console.log(`   GET/POST       http://localhost:${PORT}/api/reservas`);
    console.log(`   GET/PUT        http://localhost:${PORT}/api/reservas/:id`);
});
