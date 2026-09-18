const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const empleadoRoutes = require('./routes/empleadoRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/v1', empleadoRoutes);

// Healthcheck
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Sistema de Incidencias Municipalidad de Concordia API Activa' });
});

// Start Server if main module
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Accede a la interfaz web en http://localhost:${PORT}`);
  });
}

module.exports = app;
