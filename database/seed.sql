-- Seed Data import de la base de datos oficial de la Municipalidad de Concordia

-- Data for areas
INSERT INTO public.areas (id_area, descripcion, activo) VALUES (1, 'Legales', 1);
INSERT INTO public.areas (id_area, descripcion, activo) VALUES (2, 'Personal', 1);
INSERT INTO public.areas (id_area, descripcion, activo) VALUES (3, 'Sistemas', 1);
INSERT INTO public.areas (id_area, descripcion, activo) VALUES (4, 'Hacienda', 1);
INSERT INTO public.areas (id_area, descripcion, activo) VALUES (5, 'Finanzas', 1);
INSERT INTO public.areas (id_area, descripcion, activo) VALUES (6, 'Salud y Accion Social', 1);
INSERT INTO public.areas (id_area, descripcion, activo) VALUES (7, 'Desarrollo Urbano', 0);

-- Data for categorias
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (1, 'Perifericos', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (2, 'Notebooks', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (3, 'PC Escritorio', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (4, 'CPU', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (5, 'Almacenamiento', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (6, 'Equipos de Red', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (7, 'nueva', 0);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (8, 'test', 0);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (9, 'otra', 0);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (10, 'daw', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (11, 'daw', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (12, 'daw', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (13, 'daw', 1);
INSERT INTO public.categorias (id_categoria, descripcion, activo) VALUES (14, 'ocho', 1);

-- Data for articulos
INSERT INTO public.articulos (id_articulo, id_area, id_categoria, descripcion, activo) VALUES (1, 1, 1, 'Mouse sin pilas', 1);
INSERT INTO public.articulos (id_articulo, id_area, id_categoria, descripcion, activo) VALUES (2, 1, 1, 'Monitor LG', 1);
INSERT INTO public.articulos (id_articulo, id_area, id_categoria, descripcion, activo) VALUES (3, 1, 1, 'Notebook HP', 1);

-- Data for estados
INSERT INTO public.estados (id_estado, descripcion, activo) VALUES (1, 'Pendiente', 1);
INSERT INTO public.estados (id_estado, descripcion, activo) VALUES (2, 'En Proceso', 1);
INSERT INTO public.estados (id_estado, descripcion, activo) VALUES (3, 'Resuela', 1);
INSERT INTO public.estados (id_estado, descripcion, activo) VALUES (4, 'Cancelada', 1);

-- Data for usuarios
INSERT INTO public.usuarios (id_usuario, id_area, nombres, apellidos, usuario, contrasenia, avatar, rol, activo) VALUES
(1, 3, 'Carlos', 'Perez', 'carper@correo.com', 'fcaddfce9c7c894c376cf085b51ee37b851e89477a2986d2a26b8cc1f484eaf8', '', 2, 1),
(2, 3, 'Carmen', 'Gomez', 'cargom@correo.com', 'be4288567c04f9b827ff17cad92f29fc8ab6667bf235e7ebba558588e2606ee2', '', 2, 1),
(3, 3, 'Pamela', 'Almeida', 'pamalm@correo.com', 'be39221afb177a35f41e3dc590cc630ed8e58773dbb11a29d7a332b9e1eeaad1', '', 1, 1),
(4, 1, 'Esteban', 'Reniero', 'estren@correo.com', '31c1a3f84de963879b6e6b88e08297fcdeb419133989acf5e91cf5b75db1923f', '', 3, 1);

-- Data for incidencias
INSERT INTO public.incidencias (id_incidencia, id_articulo, id_estado, creado_por, asignado_a, prioridad, descripcion_pedido, descripcion_resolucion) VALUES
(1, 1, 1, 4, 1, 1, 'descripción pedido', ''),
(2, 1, 1, 4, 2, 1, 'descripción pedido', ''),
(3, 2, 1, 4, 1, 1, 'No enciende', ''),
(4, 3, 1, 4, 2, 1, 'No carga la batería', '');
