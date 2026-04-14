-- =============================================
-- Base de datos: hotel_reservas
-- Laboratorio 2 - API REST Gestión de Reservas
-- =============================================

CREATE DATABASE IF NOT EXISTS hotel_reservas;
USE hotel_reservas;

-- ---------------------------------------------
-- Tabla: hoteles
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS hoteles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    estrellas INT,
    telefono VARCHAR(20)
);

-- ---------------------------------------------
-- Tabla: clientes
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20)
);

-- ---------------------------------------------
-- Tabla: reservas
-- Relaciones:
--   hotel_id  -> hoteles(id)
--   cliente_id -> clientes(id)
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS reservas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    num_huespedes INT DEFAULT 1,
    hotel_id INT NOT NULL,
    cliente_id INT NOT NULL,
    FOREIGN KEY (hotel_id) REFERENCES hoteles(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- ---------------------------------------------
-- Datos de prueba (opcional)
-- ---------------------------------------------
INSERT INTO hoteles (nombre, direccion, estrellas, telefono) VALUES
    ('Hotel Paraíso', 'Calle 123, Centro', 4, '555-1234'),
    ('Hotel Costa Azul', 'Av. del Mar 456', 5, '555-5678'),
    ('Hotel Montaña', 'Km 10 Vía Sierra', 3, '555-9012');

INSERT INTO clientes (nombre, email, telefono) VALUES
    ('Juan Pérez', 'juan@email.com', '555-1111'),
    ('María García', 'maria@email.com', '555-2222'),
    ('Carlos López', 'carlos@email.com', '555-3333');

INSERT INTO reservas (fecha_entrada, fecha_salida, num_huespedes, hotel_id, cliente_id) VALUES
    ('2025-05-01', '2025-05-07', 2, 1, 1),
    ('2025-06-15', '2025-06-20', 1, 2, 2),
    ('2025-07-10', '2025-07-15', 3, 3, 3);
