const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

// Get list of employees
router.get('/usuarios/empleados', empleadoController.getEmpleados);

// List active articles
router.get('/articulos', empleadoController.getArticulos);

// Create new incident
router.post('/incidencias', empleadoController.crearIncidencia);

// List incidents by employee
router.get('/incidencias/mis-incidencias', empleadoController.getMisIncidencias);

// Cancel pending incident
router.put('/incidencias/:id/cancelar', empleadoController.cancelarIncidencia);

module.exports = router;
