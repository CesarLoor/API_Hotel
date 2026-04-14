# API REST - Gestión de Reservas de Hotel

API REST para gestionar Hoteles, Clientes y Reservas utilizando **Node.js (Express)** y **MySQL**.

## Requisitos previos

- Node.js (v18+)
- MySQL (Docker o local)

## Instalación

```bash
cd backend
npm install
```

## Configuración de la Base de Datos

### 1. Levantar MySQL con Docker

```bash
docker run -d --name mysql-hotel -p 3306:3306 -e MYSQL_ALLOW_EMPTY_PASSWORD=yes mysql:latest
```

### 2. Crear la base de datos y tablas

Ejecutar el script SQL proporcionado:

```bash
docker exec -i mysql-hotel mysql -u root < hotel_reservas.sql
```

O importarlo manualmente desde un cliente MySQL.

### 3. Configurar variables de entorno

Editar el archivo `.env` en la carpeta `backend/`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hotel_reservas
PORT=3000
```

## Ejecución

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo producción
npm start
```

El servidor se iniciará en `http://localhost:3000`

## Endpoints de la API

### Hoteles (`/api/hoteles`)

| Método | Endpoint            | Descripción                        |
|--------|--------------------|------------------------------------|
| GET    | `/api/hoteles`      | Obtener todos los hoteles          |
| GET    | `/api/hoteles/:id`  | Obtener un hotel por ID            |
| POST   | `/api/hoteles`      | Crear un nuevo hotel               |
| PUT    | `/api/hoteles/:id`  | Actualizar un hotel existente      |

### Clientes (`/api/clientes`)

| Método | Endpoint             | Descripción                         |
|--------|---------------------|-------------------------------------|
| GET    | `/api/clientes`      | Obtener todos los clientes          |
| GET    | `/api/clientes/:id`  | Obtener un cliente por ID           |
| POST   | `/api/clientes`      | Crear un nuevo cliente              |
| PUT    | `/api/clientes/:id`  | Actualizar un cliente existente     |

### Reservas (`/api/reservas`)

| Método | Endpoint             | Descripción                         |
|--------|---------------------|-------------------------------------|
| GET    | `/api/reservas`      | Obtener todas las reservas          |
| GET    | `/api/reservas/:id`  | Obtener una reserva por ID          |
| POST   | `/api/reservas`      | Crear una nueva reserva             |
| PUT    | `/api/reservas/:id`  | Actualizar una reserva existente    |

## Ejemplos de Body (JSON)

### Crear Hotel
```json
{
    "nombre": "Hotel Paraíso",
    "direccion": "Calle 123",
    "estrellas": 4,
    "telefono": "555-1234"
}
```

### Crear Cliente
```json
{
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "telefono": "555-5678"
}
```

### Crear Reserva
```json
{
    "fecha_entrada": "2025-05-01",
    "fecha_salida": "2025-05-07",
    "num_huespedes": 2,
    "hotel_id": 1,
    "cliente_id": 1
}
```

## Estructura del proyecto

```
backend/
├── .env                  # Variables de entorno
├── .env.example          # Ejemplo de configuración
├── hotel_reservas.sql    # Script SQL de la base de datos
├── package.json
└── src/
    ├── app.js            # Entrada principal (Express)
    ├── config/
    │   └── db.js         # Conexión a MySQL
    ├── controllers/
    │   ├── hotelController.js
    │   ├── clienteController.js
    │   └── reservaController.js
    ├── models/
    │   ├── hotelModel.js
    │   ├── clienteModel.js
    │   └── reservaModel.js
    └── routes/
        ├── hotelRoutes.js
        ├── clienteRoutes.js
        └── reservaRoutes.js
```

## Códigos de estado HTTP

| Código | Descripción                                   |
|--------|-----------------------------------------------|
| 200    | Petición GET o PUT exitosa                    |
| 201    | Recurso creado exitosamente (POST)            |
| 400    | Datos inválidos o campos obligatorios faltantes|
| 404    | Recurso no encontrado                         |
| 500    | Error interno del servidor                    |