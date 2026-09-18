-- Seed Data de Prueba para la Municipalidad de Concordia

-- Insertar Áreas
INSERT INTO areas (descripcion, activo) VALUES
('Mesa de Entrada y Atención al Ciudadano', 1),
('Obras Públicas y Servicios', 1),
('Hacienda y Finanzas', 1),
('Área de Sistemas e Informática', 1),
('Recursos Humanos', 1);

-- Insertar Categorías
INSERT INTO categorias (descripcion, activo) VALUES
('Equipos Informáticos', 1),
('Periféricos y Accesorios', 1),
('Conectividad y Redes', 1),
('Sistemas y Software', 1),
('Telefonía', 1);

-- Insertar Artículos
INSERT INTO articulos (id_area, id_categoria, descripcion, activo) VALUES
(1, 1, 'PC Desktop Intel Core i5 - Mesa Entrada', 1),
(1, 2, 'Impresora Multifunción HP LaserJet', 1),
(2, 1, 'Notebook Lenovo ThinkPad - Obras Públicas', 1),
(2, 3, 'Switch de Red 24 Puertos Cisco', 1),
(3, 2, 'Lector de Código de Barras USB', 1),
(4, 1, 'Servidor de Base de Datos Dell PowerEdge', 1),
(5, 5, 'Teléfono IP Grandstream - RRHH', 1);

-- Insertar Estados
INSERT INTO estados (descripcion, activo) VALUES
('Pendiente', 1),
('En Proceso', 1),
('Finalizada', 1),
('Cancelada', 1);

-- Insertar Usuarios (Rol 1: Empleado Municipal, Rol 2: Empleado Sistemas, Rol 3: Director Sistemas)
INSERT INTO usuarios (id_area, nombres, apellidos, usuario, contrasenia, avatar, rol, activo) VALUES
(1, 'María', 'González', 'mgonzalez', '123456', 'avatar1.png', 1, 1),
(2, 'Juan', 'Pérez', 'jperez', '123456', 'avatar2.png', 1, 1),
(3, 'Carlos', 'Rodríguez', 'crodriguez', '123456', 'avatar3.png', 1, 1),
(4, 'Ana', 'Martínez', 'amartinez', '123456', 'avatar4.png', 2, 1),
(4, 'Roberto', 'Sánchez', 'rsanchez', '123456', 'avatar5.png', 3, 1);

-- Insertar Incidencias de Prueba
INSERT INTO incidencias (id_articulo, id_estado, creado_por, asignado_a, prioridad, descripcion_pedido) VALUES
(2, 1, 1, NULL, 1, 'La impresora multifunción no enciende y emite un pitido al conectar.'),
(1, 1, 1, NULL, 2, 'El equipo de escritorio funciona muy lento al abrir el sistema de administración.'),
(3, 4, 2, NULL, 3, 'El teclado de la notebook tiene floja la tecla Enter. (Cancelada por el usuario)');

-- Historial de Estados de Incidencias
INSERT INTO incidencias_estados (id_incidencia, id_estado, fecha_hora_estado) VALUES
(1, 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(3, 1, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 4, CURRENT_TIMESTAMP - INTERVAL '2 days');
