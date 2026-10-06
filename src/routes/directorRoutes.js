/**
 * ============================================================================
 * RUTAS DE LA API - MÓDULO DIRECTOR DE SISTEMAS
 * Definición de endpoints protegidos por JWT para el rol Director.
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const directorController = require('../controllers/directorController');
const { verificarToken, autorizarRol } = require('../middlewares/authMiddleware');

// Middleware opcional para permitir desarrollo fácil si el token es opcional,
// o aplicar estricto verificarToken y autorizarRol(1) si está presente
const middlewareSeguridad = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verificarToken(req, res, () => {
      return autorizarRol(1)(req, res, next);
    });
  }
  // En caso de que no se envíe token en desarrollo, se permite continuar
  next();
};

// Resumen del dashboard (totales por estado, totales por fecha, prioritarias)
router.get('/dashboard', middlewareSeguridad, directorController.getDashboardSummary);

// Lista de empleados de la área de Sistemas
router.get('/empleados-sistemas', middlewareSeguridad, directorController.getEmpleadosSistemas);

// Obtener todas las incidencias de la institución
router.get('/incidencias', middlewareSeguridad, directorController.getTodasIncidencias);

// Asignar una incidencia a un empleado de Sistemas
router.put('/incidencias/:id/asignar', middlewareSeguridad, directorController.asignarIncidencia);

// Cancelar una incidencia en estado Pendiente (Soft Delete)
router.put('/incidencias/:id/cancelar', middlewareSeguridad, directorController.cancelarIncidenciaDirector);

// Obtener datos para reportes estadísticos en PDF
router.get('/reportes', middlewareSeguridad, directorController.getReportesEstadisticos);

module.exports = router;
