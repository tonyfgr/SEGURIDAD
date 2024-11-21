-- Crear la base de datos (si no se ha creado ya)
CREATE DATABASE IF NOT EXISTS epp;

-- Usar la base de datos
USE epp;

-- Crear tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    correo VARCHAR(50),
    contrasena VARCHAR(50)
);

-- Insertar un usuario de ejemplo
INSERT INTO usuario (nombre, correo, contrasena) VALUES 
('Josselyn', 'josselyn.lobos@tecsup.edu.pe', 'seguridadE1');

-- Crear tabla infracciones_casco
CREATE TABLE IF NOT EXISTS infracciones_casco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(255) DEFAULT 'Sin casco'
);

-- Crear tabla infracciones_chaleco
CREATE TABLE IF NOT EXISTS infracciones_chaleco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(255) DEFAULT 'Sin chaleco'
);

-- Crear tabla infracciones_zapatos
CREATE TABLE IF NOT EXISTS infracciones_zapatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(255) DEFAULT 'Sin zapatos'
);

-- Crear tabla infracciones_guantes
CREATE TABLE IF NOT EXISTS infracciones_guantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(255) DEFAULT 'Sin guantes'
);
