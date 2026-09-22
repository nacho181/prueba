/**
 * ============================================================================
 * SERVIDOR PRINCIPAL HTTP - EXPRESS
 * Punto de entrada de la aplicación backend Node.js.
 * Configuración de middlewares, archivos estáticos y rutas de la API.
 * ============================================================================
 */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const empleadoRoutes = require('./routes/empleadoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARES DE LA APLICACIÓN
// ============================================================================

// Morgan: Registro detallado de solicitudes HTTP en consola
app.use(morgan('dev'));

// Express JSON & Urlencoded: Parseo de cuerpos de peticiones HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servidor de archivos estáticos (Frontend Web: HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// ============================================================================
// RUTAS DE LA API REST Y COMPROBACIÓN DE SALUD
// ============================================================================

// Prefijo de versión de API REST (/api/v1)
app.use('/api/v1', empleadoRoutes);

// Ruta de Comprobación de Salud del Servidor (Healthcheck)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    estado: 'OK',
    mensaje: 'Servidor activo - Municipalidad de Concordia',
    timestamp: new Date()
  });
});

// Ruta por defecto para SPA o fallback HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ============================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================================

// Iniciar el servidor únicamente si el archivo es ejecutado directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Accede a la interfaz web en http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
