# API REST - Gestión de Reservas de Hotel

API REST para gestionar Hoteles, Clientes y Reservas utilizando **Node.js (Express)** y **MySQL**.

## Requisitos previos

- Node.js (v18+)
- MySQL (Docker o local)
- OWASP ZAP (para pruebas de seguridad)

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

---

## 📚 Documentación Swagger (OpenAPI)

La API cuenta con documentación interactiva generada automáticamente con **Swagger UI** usando `swagger-jsdoc` y `swagger-ui-express`.

### Acceso a la documentación

| Recurso | URL |
|---|---|
| Swagger UI (interfaz visual) | `http://localhost:3000/api-docs` |
| OpenAPI JSON (spec raw) | `http://localhost:3000/api-docs/openapi.json` |

### Dependencias instaladas

```json
"swagger-jsdoc": "^6.2.8",
"swagger-ui-express": "^5.0.1"
```

### Cómo funciona

La documentación se genera a partir de comentarios JSDoc en los archivos de rutas (`src/routes/*.js`). El archivo `src/config/swagger.js` centraliza la configuración de la especificación OpenAPI 3.0.

### Vista de Swagger UI

La interfaz permite:
- Explorar todos los endpoints disponibles
- Probar peticiones directamente desde el navegador (Try it out)
- Ver los esquemas de request/response y códigos de estado HTTP

---

## Endpoints de la API

### Hoteles (`/api/hoteles`)

| Método | Endpoint            | Descripción                        |
|--------|--------------------|--------------------------------------|
| GET    | `/api/hoteles`      | Obtener todos los hoteles           |
| GET    | `/api/hoteles/:id`  | Obtener un hotel por ID             |
| POST   | `/api/hoteles`      | Crear un nuevo hotel                |
| PUT    | `/api/hoteles/:id`  | Actualizar un hotel existente       |

### Clientes (`/api/clientes`)

| Método | Endpoint             | Descripción                         |
|--------|---------------------|--------------------------------------|
| GET    | `/api/clientes`      | Obtener todos los clientes          |
| GET    | `/api/clientes/:id`  | Obtener un cliente por ID           |
| POST   | `/api/clientes`      | Crear un nuevo cliente              |
| PUT    | `/api/clientes/:id`  | Actualizar un cliente existente     |

### Reservas (`/api/reservas`)

| Método | Endpoint             | Descripción                         |
|--------|---------------------|--------------------------------------|
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

---

## 🛡️ Pruebas de Seguridad con OWASP ZAP

La API fue analizada con **OWASP ZAP (Zed Attack Proxy)** para identificar vulnerabilidades basadas en el **OWASP API Top 10**.

### Requisitos

- [OWASP ZAP](https://www.zaproxy.org/download/) instalado
- API corriendo en `http://localhost:3000`

### Procedimiento de escaneo

#### 1. Importar la especificación OpenAPI

1. Abre OWASP ZAP
2. Ve a **Import → Import an OpenAPI definition from a URL**
3. Ingresa la URL del spec:
   ```
   http://localhost:3000/api-docs/openapi.json
   ```
4. Haz clic en **Import** — ZAP cargará automáticamente todos los endpoints

#### 2. Ejecutar Active Scan

1. En el árbol de **Sites**, selecciona `http://localhost:3000`
2. Clic derecho → **Attack → Active Scan**
3. Asegúrate de que el contexto incluya todos los endpoints (`/api/hoteles`, `/api/clientes`, `/api/reservas`)
4. Haz clic en **Start Scan**

#### 3. Revisar resultados

Una vez finalizado el escaneo, los resultados aparecen en la pestaña **Alerts**:

| Nivel      | Color  | Descripción                                     |
|------------|--------|-------------------------------------------------|
| 🔴 High    | Rojo   | Vulnerabilidad crítica, requiere acción inmediata |
| 🟠 Medium  | Naranja| Riesgo moderado a corregir                      |
| 🟡 Low     | Amarillo | Riesgo bajo, buena práctica corregirlo         |
| 🔵 Informational | Azul | Solo informativo, sin riesgo directo       |

#### 4. Generar reporte

Ve a **Report → Generate Report** y selecciona el formato deseado (HTML, PDF, JSON, XML).

### Vulnerabilidades identificadas

Las alertas más comunes encontradas en APIs REST y que ZAP verifica incluyen:

| Alerta | Nivel | Descripción | Mitigación |
|---|---|---|---|
| Missing Anti-clickjacking Header | Medium | Falta header `X-Frame-Options` | Agregar `helmet.js` |
| X-Content-Type-Options Header Missing | Low | Falta header `nosniff` | Configurar con `helmet` |
| Application Error Disclosure | Medium | Mensajes de error expuestos al cliente | Sanitizar respuestas de error |
| Content Security Policy (CSP) Header Not Set | Medium | Falta CSP en respuestas | Configurar política CSP |
| Server Leaks Version Information | Low | Header `X-Powered-By: Express` expuesto | `app.disable('x-powered-by')` |

### Buenas prácticas aplicadas

- ✅ Validación de campos requeridos en todos los endpoints POST/PUT
- ✅ Respuestas con códigos HTTP semánticos (200, 201, 400, 404, 500)
- ✅ CORS configurado con `cors()`
- ✅ Documentación OpenAPI 3.0 completa para facilitar auditorías
- ⚙️ Recomendado: agregar `helmet` para headers de seguridad HTTP

---

## Estructura del proyecto

```
backend/
├── .env                  # Variables de entorno
├── .env.example          # Ejemplo de configuración
├── hotel_reservas.sql    # Script SQL de la base de datos
├── package.json
└── src/
    ├── app.js            # Entrada principal (Express + Swagger)
    ├── config/
    │   ├── db.js         # Conexión a MySQL
    │   └── swagger.js    # Configuración OpenAPI / Swagger
    ├── controllers/
    │   ├── hotelController.js
    │   ├── clienteController.js
    │   └── reservaController.js
    ├── models/
    │   ├── hotelModel.js
    │   ├── clienteModel.js
    │   └── reservaModel.js
    └── routes/
        ├── hotelRoutes.js       # JSDoc con anotaciones Swagger
        ├── clienteRoutes.js
        └── reservaRoutes.js
```

## Códigos de estado HTTP

| Código | Descripción                                    |
|--------|------------------------------------------------|
| 200    | Petición GET o PUT exitosa                     |
| 201    | Recurso creado exitosamente (POST)             |
| 400    | Datos inválidos o campos obligatorios faltantes|
| 404    | Recurso no encontrado                          |
| 500    | Error interno del servidor                     |

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | v18+ | Runtime |
| Express | ^4.21 | Framework HTTP |
| MySQL2 | ^3.11 | Driver de base de datos |
| swagger-jsdoc | ^6.2.8 | Generación de spec OpenAPI |
| swagger-ui-express | ^5.0.1 | Interfaz visual Swagger |
| OWASP ZAP | Latest | Pruebas de seguridad |
| Docker | Latest | Contenedor MySQL |