const db = require('../config/db');

// In-memory fallback data matching the new database dump
let localUsuarios = [
  { id_usuario: 1, nombres: 'Carlos', apellidos: 'Perez', usuario: 'carper@correo.com', rol: 2, id_area: 3, area_nombre: 'Sistemas' },
  { id_usuario: 2, nombres: 'Carmen', apellidos: 'Gomez', usuario: 'cargom@correo.com', rol: 2, id_area: 3, area_nombre: 'Sistemas' },
  { id_usuario: 3, nombres: 'Pamela', apellidos: 'Almeida', usuario: 'pamalm@correo.com', rol: 1, id_area: 3, area_nombre: 'Sistemas' },
  { id_usuario: 4, nombres: 'Esteban', apellidos: 'Reniero', usuario: 'estren@correo.com', rol: 3, id_area: 1, area_nombre: 'Legales' }
];

let localArticulos = [
  { id_articulo: 1, descripcion: 'Mouse sin pilas', id_area: 1, area_nombre: 'Legales', id_categoria: 1, categoria_nombre: 'Perifericos', activo: 1 },
  { id_articulo: 2, descripcion: 'Monitor LG', id_area: 1, area_nombre: 'Legales', id_categoria: 1, categoria_nombre: 'Perifericos', activo: 1 },
  { id_articulo: 3, descripcion: 'Notebook HP', id_area: 1, area_nombre: 'Legales', id_categoria: 1, categoria_nombre: 'Perifericos', activo: 1 }
];

let localIncidencias = [
  {
    id_incidencia: 1,
    id_articulo: 1,
    articulo_nombre: 'Mouse sin pilas',
    id_estado: 1,
    estado_nombre: 'Pendiente',
    creado_por: 4,
    creado_por_nombre: 'Esteban Reniero',
    asignado_a: 1,
    creado: '2026-09-11T18:47:38.751Z',
    prioridad: 1,
    descripcion_pedido: 'descripción pedido',
    descripcion_resolucion: ''
  },
  {
    id_incidencia: 2,
    id_articulo: 1,
    articulo_nombre: 'Mouse sin pilas',
    id_estado: 1,
    estado_nombre: 'Pendiente',
    creado_por: 4,
    creado_por_nombre: 'Esteban Reniero',
    asignado_a: 2,
    creado: '2026-09-11T18:50:08.269Z',
    prioridad: 1,
    descripcion_pedido: 'descripción pedido',
    descripcion_resolucion: ''
  },
  {
    id_incidencia: 3,
    id_articulo: 2,
    articulo_nombre: 'Monitor LG',
    id_estado: 1,
    estado_nombre: 'Pendiente',
    creado_por: 4,
    creado_por_nombre: 'Esteban Reniero',
    asignado_a: 1,
    creado: '2026-09-13T18:52:15.532Z',
    prioridad: 1,
    descripcion_pedido: 'No enciende',
    descripcion_resolucion: ''
  },
  {
    id_incidencia: 4,
    id_articulo: 3,
    articulo_nombre: 'Notebook HP',
    id_estado: 1,
    estado_nombre: 'Pendiente',
    creado_por: 4,
    creado_por_nombre: 'Esteban Reniero',
    asignado_a: 2,
    creado: '2026-09-13T18:52:51.346Z',
    prioridad: 1,
    descripcion_pedido: 'No carga la batería',
    descripcion_resolucion: ''
  }
];

async function isDbAvailable() {
  try {
    await db.query('SELECT 1');
    return true;
  } catch (err) {
    return false;
  }
}

// 1. Get employees list
exports.getEmpleados = async (req, res) => {
  try {
    if (await isDbAvailable()) {
      const query = `
        SELECT u.id_usuario, u.nombres, u.apellidos, u.usuario, u.id_area, u.rol, a.descripcion AS area_nombre
        FROM usuarios u
        LEFT JOIN areas a ON u.id_area = a.id_area
        WHERE u.activo = 1
        ORDER BY u.id_usuario ASC
      `;
      const result = await db.query(query);
      return res.status(200).json({ status: 'success', data: result.rows });
    } else {
      return res.status(200).json({ status: 'success', data: localUsuarios });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. List active articles
exports.getArticulos = async (req, res) => {
  try {
    if (await isDbAvailable()) {
      const query = `
        SELECT
          art.id_articulo,
          art.descripcion,
          art.id_area,
          ar.descripcion AS area_nombre,
          art.id_categoria,
          cat.descripcion AS categoria_nombre,
          art.activo
        FROM articulos art
        LEFT JOIN areas ar ON art.id_area = ar.id_area
        LEFT JOIN categorias cat ON art.id_categoria = cat.id_categoria
        WHERE art.activo = 1
        ORDER BY art.id_articulo ASC
      `;
      const result = await db.query(query);
      return res.status(200).json({ status: 'success', data: result.rows });
    } else {
      return res.status(200).json({ status: 'success', data: localArticulos });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. Create incident
exports.crearIncidencia = async (req, res) => {
  try {
    const { id_articulo, creado_por, prioridad, descripcion_pedido } = req.body;

    if (!id_articulo || !creado_por || !descripcion_pedido) {
      return res.status(400).json({
        status: 'fail',
        message: 'Faltan campos obligatorios: id_articulo, creado_por y descripcion_pedido.'
      });
    }

    if (await isDbAvailable()) {
      // In the dump, default asignado_a = 1 (Carlos Perez) or 0
      const insertQuery = `
        INSERT INTO incidencias (id_articulo, id_estado, creado_por, asignado_a, prioridad, descripcion_pedido, descripcion_resolucion, creado)
        VALUES ($1, 1, $2, 1, $3, $4, '', CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const result = await db.query(insertQuery, [
        id_articulo,
        creado_por,
        prioridad || 1,
        descripcion_pedido
      ]);

      const nuevaIncidencia = result.rows[0];

      // Record in history table
      await db.query(
        `INSERT INTO incidencias_estados (id_incidencia, id_estado) VALUES ($1, 1)`,
        [nuevaIncidencia.id_incidencia]
      );

      return res.status(201).json({
        status: 'success',
        message: 'Incidencia creada con éxito',
        data: nuevaIncidencia
      });
    } else {
      const art = localArticulos.find(a => a.id_articulo === parseInt(id_articulo));
      const usuario = localUsuarios.find(u => u.id_usuario === parseInt(creado_por));

      const nuevaIncidencia = {
        id_incidencia: localIncidencias.length + 1,
        id_articulo: parseInt(id_articulo),
        articulo_nombre: art ? art.descripcion : 'Artículo Desconocido',
        id_estado: 1,
        estado_nombre: 'Pendiente',
        creado_por: parseInt(creado_por),
        creado_por_nombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Usuario',
        asignado_a: 1,
        creado: new Date().toISOString(),
        prioridad: parseInt(prioridad) || 1,
        descripcion_pedido,
        descripcion_resolucion: ''
      };

      localIncidencias.unshift(nuevaIncidencia);

      return res.status(201).json({
        status: 'success',
        message: 'Incidencia creada con éxito',
        data: nuevaIncidencia
      });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. List incidents created by employee
exports.getMisIncidencias = async (req, res) => {
  try {
    const { id_usuario } = req.query;

    if (!id_usuario) {
      return res.status(400).json({
        status: 'fail',
        message: 'Se requiere el parámetro id_usuario'
      });
    }

    if (await isDbAvailable()) {
      const query = `
        SELECT
          inc.id_incidencia,
          inc.id_articulo,
          art.descripcion AS articulo_nombre,
          inc.id_estado,
          est.descripcion AS estado_nombre,
          inc.creado_por,
          CONCAT(u.nombres, ' ', u.apellidos) AS creado_por_nombre,
          inc.asignado_a,
          inc.creado,
          inc.prioridad,
          inc.descripcion_pedido,
          inc.descripcion_resolucion
        FROM incidencias inc
        INNER JOIN articulos art ON inc.id_articulo = art.id_articulo
        INNER JOIN estados est ON inc.id_estado = est.id_estado
        INNER JOIN usuarios u ON inc.creado_por = u.id_usuario
        WHERE inc.creado_por = $1
        ORDER BY inc.id_incidencia DESC
      `;
      const result = await db.query(query, [id_usuario]);
      return res.status(200).json({ status: 'success', data: result.rows });
    } else {
      const usuarioIncidencias = localIncidencias.filter(
        inc => inc.creado_por === parseInt(id_usuario)
      );
      return res.status(200).json({ status: 'success', data: usuarioIncidencias });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. Cancel pending incident by employee
exports.cancelarIncidencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.body;

    if (!id_usuario) {
      return res.status(400).json({
        status: 'fail',
        message: 'Se requiere id_usuario para verificar la propiedad de la incidencia'
      });
    }

    if (await isDbAvailable()) {
      const checkQuery = `SELECT * FROM incidencias WHERE id_incidencia = $1`;
      const checkResult = await db.query(checkQuery, [id]);

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ status: 'fail', message: 'Incidencia no encontrada' });
      }

      const incidencia = checkResult.rows[0];

      if (incidencia.creado_por !== parseInt(id_usuario)) {
        return res.status(403).json({ status: 'fail', message: 'No tiene permiso para cancelar esta incidencia' });
      }

      if (incidencia.id_estado !== 1) { // 1 = Pendiente
        return res.status(400).json({ status: 'fail', message: 'Solo se pueden cancelar incidencias con estado Pendiente' });
      }

      // Update state to 'Cancelada' (id_estado = 4)
      const updateQuery = `
        UPDATE incidencias
        SET id_estado = 4
        WHERE id_incidencia = $1
        RETURNING *
      `;
      const updateResult = await db.query(updateQuery, [id]);

      // Record state history
      await db.query(
        `INSERT INTO incidencias_estados (id_incidencia, id_estado) VALUES ($1, 4)`,
        [id]
      );

      return res.status(200).json({
        status: 'success',
        message: 'Incidencia cancelada exitosamente',
        data: updateResult.rows[0]
      });
    } else {
      const idx = localIncidencias.findIndex(i => i.id_incidencia === parseInt(id));
      if (idx === -1) {
        return res.status(404).json({ status: 'fail', message: 'Incidencia no encontrada' });
      }

      if (localIncidencias[idx].creado_por !== parseInt(id_usuario)) {
        return res.status(403).json({ status: 'fail', message: 'No tiene permiso para cancelar esta incidencia' });
      }

      if (localIncidencias[idx].id_estado !== 1) {
        return res.status(400).json({ status: 'fail', message: 'Solo se pueden cancelar incidencias en estado Pendiente' });
      }

      localIncidencias[idx].id_estado = 4;
      localIncidencias[idx].estado_nombre = 'Cancelada';

      return res.status(200).json({
        status: 'success',
        message: 'Incidencia cancelada exitosamente',
        data: localIncidencias[idx]
      });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
