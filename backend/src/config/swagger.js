// =============================================
// Configuración de Swagger / OpenAPI 3.0
// Para testeo con OWASP ZAP
// =============================================
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST - Gestión de Reservas de Hotel',
            version: '1.0.0',
            description:
                'API REST para gestión de hoteles, clientes y reservas. ' +
                'Laboratorio 2 — Seguridad evaluada con OWASP ZAP.',
            contact: {
                name: 'Soporte API',
                email: 'soporte@hotel.local',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo local',
            },
        ],
        components: {
            schemas: {
                // ─── Hotel ───────────────────────────────────────────
                Hotel: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                            description: 'ID único del hotel',
                        },
                        nombre: {
                            type: 'string',
                            example: 'Grand Hotel Plaza',
                            description: 'Nombre del hotel',
                        },
                        direccion: {
                            type: 'string',
                            example: 'Av. Principal 123, Quito',
                            description: 'Dirección completa del hotel',
                        },
                        categoria: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            example: 4,
                            description: 'Categoría de estrellas (1-5)',
                        },
                        num_habitaciones: {
                            type: 'integer',
                            example: 120,
                            description: 'Número total de habitaciones',
                        },
                    },
                },
                HotelInput: {
                    type: 'object',
                    required: ['nombre', 'direccion', 'categoria'],
                    properties: {
                        nombre: {
                            type: 'string',
                            example: 'Grand Hotel Plaza',
                        },
                        direccion: {
                            type: 'string',
                            example: 'Av. Principal 123, Quito',
                        },
                        categoria: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            example: 4,
                        },
                        num_habitaciones: {
                            type: 'integer',
                            example: 120,
                        },
                    },
                },
                // ─── Cliente ─────────────────────────────────────────
                Cliente: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        nombre: {
                            type: 'string',
                            example: 'Juan Pérez',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'juan.perez@email.com',
                        },
                        telefono: {
                            type: 'string',
                            example: '+593999123456',
                        },
                        dni: {
                            type: 'string',
                            example: '1234567890',
                        },
                    },
                },
                ClienteInput: {
                    type: 'object',
                    required: ['nombre', 'email'],
                    properties: {
                        nombre: {
                            type: 'string',
                            example: 'Juan Pérez',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'juan.perez@email.com',
                        },
                        telefono: {
                            type: 'string',
                            example: '+593999123456',
                        },
                        dni: {
                            type: 'string',
                            example: '1234567890',
                        },
                    },
                },
                // ─── Reserva ─────────────────────────────────────────
                Reserva: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        fecha_entrada: {
                            type: 'string',
                            format: 'date',
                            example: '2026-05-01',
                        },
                        fecha_salida: {
                            type: 'string',
                            format: 'date',
                            example: '2026-05-05',
                        },
                        num_huespedes: {
                            type: 'integer',
                            example: 2,
                        },
                        hotel_id: {
                            type: 'integer',
                            example: 1,
                        },
                        cliente_id: {
                            type: 'integer',
                            example: 1,
                        },
                        hotel_nombre: {
                            type: 'string',
                            example: 'Grand Hotel Plaza',
                        },
                        cliente_nombre: {
                            type: 'string',
                            example: 'Juan Pérez',
                        },
                    },
                },
                ReservaInput: {
                    type: 'object',
                    required: ['fecha_entrada', 'fecha_salida', 'hotel_id', 'cliente_id'],
                    properties: {
                        fecha_entrada: {
                            type: 'string',
                            format: 'date',
                            example: '2026-05-01',
                        },
                        fecha_salida: {
                            type: 'string',
                            format: 'date',
                            example: '2026-05-05',
                        },
                        num_huespedes: {
                            type: 'integer',
                            example: 2,
                        },
                        hotel_id: {
                            type: 'integer',
                            example: 1,
                        },
                        cliente_id: {
                            type: 'integer',
                            example: 1,
                        },
                    },
                },
                // ─── Respuestas de error ──────────────────────────────
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'Mensaje de error descriptivo',
                        },
                    },
                },
            },
        },
        // Las rutas se leen desde los archivos de rutas con @swagger JSDoc
        paths: {
            // ═══════════════════════════════════════════════
            // HOTELES
            // ═══════════════════════════════════════════════
            '/api/hoteles': {
                get: {
                    tags: ['Hoteles'],
                    summary: 'Obtener todos los hoteles',
                    description: 'Retorna la lista completa de hoteles registrados.',
                    operationId: 'getAllHoteles',
                    responses: {
                        200: {
                            description: 'Lista de hoteles obtenida exitosamente',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Hotel' },
                                    },
                                },
                            },
                        },
                        500: {
                            description: 'Error interno del servidor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
                post: {
                    tags: ['Hoteles'],
                    summary: 'Crear un nuevo hotel',
                    description: 'Registra un nuevo hotel en el sistema.',
                    operationId: 'createHotel',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/HotelInput' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Hotel creado exitosamente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Hotel' },
                                },
                            },
                        },
                        400: {
                            description: 'Datos inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                        500: {
                            description: 'Error interno del servidor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
            },
            '/api/hoteles/{id}': {
                get: {
                    tags: ['Hoteles'],
                    summary: 'Obtener hotel por ID',
                    operationId: 'getHotelById',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID del hotel',
                            schema: { type: 'integer', example: 1 },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Hotel encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Hotel' },
                                },
                            },
                        },
                        404: {
                            description: 'Hotel no encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                        500: {
                            description: 'Error interno del servidor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
                put: {
                    tags: ['Hoteles'],
                    summary: 'Actualizar hotel por ID',
                    operationId: 'updateHotel',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID del hotel',
                            schema: { type: 'integer', example: 1 },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/HotelInput' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Hotel actualizado exitosamente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Hotel' },
                                },
                            },
                        },
                        404: {
                            description: 'Hotel no encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                        500: {
                            description: 'Error interno del servidor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
            },
            // ═══════════════════════════════════════════════
            // CLIENTES
            // ═══════════════════════════════════════════════
            '/api/clientes': {
                get: {
                    tags: ['Clientes'],
                    summary: 'Obtener todos los clientes',
                    operationId: 'getAllClientes',
                    responses: {
                        200: {
                            description: 'Lista de clientes',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Cliente' },
                                    },
                                },
                            },
                        },
                        500: {
                            description: 'Error interno del servidor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
                post: {
                    tags: ['Clientes'],
                    summary: 'Crear un nuevo cliente',
                    operationId: 'createCliente',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ClienteInput' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Cliente creado exitosamente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Cliente' },
                                },
                            },
                        },
                        400: {
                            description: 'Datos inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                        500: {
                            description: 'Error interno del servidor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
            },
            '/api/clientes/{id}': {
                get: {
                    tags: ['Clientes'],
                    summary: 'Obtener cliente por ID',
                    operationId: 'getClienteById',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID del cliente',
                            schema: { type: 'integer', example: 1 },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Cliente encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Cliente' },
                                },
                            },
                        },
                        404: {
                            description: 'Cliente no encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
                put: {
                    tags: ['Clientes'],
                    summary: 'Actualizar cliente por ID',
                    operationId: 'updateCliente',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID del cliente',
                            schema: { type: 'integer', example: 1 },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ClienteInput' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Cliente actualizado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Cliente' },
                                },
                            },
                        },
                        404: {
                            description: 'Cliente no encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
            },
            // ═══════════════════════════════════════════════
            // RESERVAS
            // ═══════════════════════════════════════════════
            '/api/reservas': {
                get: {
                    tags: ['Reservas'],
                    summary: 'Obtener todas las reservas',
                    operationId: 'getAllReservas',
                    responses: {
                        200: {
                            description: 'Lista de reservas con datos del hotel y cliente',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Reserva' },
                                    },
                                },
                            },
                        },
                        500: {
                            description: 'Error interno del servidor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
                post: {
                    tags: ['Reservas'],
                    summary: 'Crear una nueva reserva',
                    operationId: 'createReserva',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ReservaInput' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Reserva creada exitosamente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Reserva' },
                                },
                            },
                        },
                        400: {
                            description: 'Datos inválidos o FK no existe',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                        500: {
                            description: 'Error interno del servidor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
            },
            '/api/reservas/{id}': {
                get: {
                    tags: ['Reservas'],
                    summary: 'Obtener reserva por ID',
                    operationId: 'getReservaById',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID de la reserva',
                            schema: { type: 'integer', example: 1 },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Reserva encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Reserva' },
                                },
                            },
                        },
                        404: {
                            description: 'Reserva no encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
                put: {
                    tags: ['Reservas'],
                    summary: 'Actualizar reserva por ID',
                    operationId: 'updateReserva',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID de la reserva',
                            schema: { type: 'integer', example: 1 },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ReservaInput' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Reserva actualizada exitosamente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Reserva' },
                                },
                            },
                        },
                        400: {
                            description: 'Datos inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                        404: {
                            description: 'Reserva no encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [], // paths definidos directamente arriba
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
