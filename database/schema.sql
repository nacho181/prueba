-- Schema SQL para la Municipalidad de Concordia - Sistema de Registro de Incidencias

DROP TABLE IF EXISTS incidencias_estados CASCADE;
DROP TABLE IF EXISTS incidencias CASCADE;
DROP TABLE IF EXISTS estados CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS articulos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS areas CASCADE;

CREATE TABLE areas (
    id_area SERIAL PRIMARY KEY,
    descripcion VARCHAR(150) NOT NULL,
    activo SMALLINT DEFAULT 1
);

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    descripcion VARCHAR(150) NOT NULL,
    activo SMALLINT DEFAULT 1
);

CREATE TABLE articulos (
    id_articulo SERIAL PRIMARY KEY,
    id_area INTEGER REFERENCES areas(id_area),
    id_categoria INTEGER REFERENCES categorias(id_categoria),
    descripcion VARCHAR(200) NOT NULL,
    activo SMALLINT DEFAULT 1
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_area INTEGER REFERENCES areas(id_area),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    rol INTEGER DEFAULT 1, -- 1: Empleado Municipal, 2: Empleado Sistemas, 3: Director Sistemas
    activo SMALLINT DEFAULT 1
);

CREATE TABLE estados (
    id_estado SERIAL PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL,
    activo SMALLINT DEFAULT 1
);

CREATE TABLE incidencias (
    id_incidencia SERIAL PRIMARY KEY,
    id_articulo INTEGER REFERENCES articulos(id_articulo),
    id_estado INTEGER REFERENCES estados(id_estado),
    creado_por INTEGER REFERENCES usuarios(id_usuario),
    asignado_a INTEGER REFERENCES usuarios(id_usuario),
    creado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    prioridad INTEGER DEFAULT 2, -- 1: Alta, 2: Media, 3: Baja
    descripcion_pedido TEXT NOT NULL,
    descripcion_resolucion TEXT
);

CREATE TABLE incidencias_estados (
    id_pedidos_estados SERIAL PRIMARY KEY,
    id_incidencia INTEGER REFERENCES incidencias(id_incidencia) ON DELETE CASCADE,
    id_estado INTEGER REFERENCES estados(id_estado),
    fecha_hora_estado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
