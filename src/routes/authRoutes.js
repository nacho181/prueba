/**
 * ============================================================================
 * RUTAS DE AUTENTICACIÓN
 * Endpoints públicos y protegidos vinculados a la gestión de sesión.
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

// POST /api/v1/auth/login - Autenticación de usuario
router.post('/login', authController.login);

// GET /api/v1/auth/me - Obtener información del usuario logueado
router.get('/me', verificarToken, authController.obtenerUsuarioActual);

module.exports = router;