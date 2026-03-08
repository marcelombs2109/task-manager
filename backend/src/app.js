require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const tasksRouter = require('./routes/tasks');
const { getDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3020;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS: en producción solo permite el dominio del frontend
app.use(cors({
  origin: NODE_ENV === 'production' ? CLIENT_URL : '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

app.use(express.json());
app.use('/api/tasks', tasksRouter);

// En producción, servir el build del frontend desde el backend
if (NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicializar DB antes de arrancar
getDb().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en http://localhost:${PORT} [${NODE_ENV}]`);
  });
}).catch(err => {
  console.error('❌ Error al inicializar la base de datos:', err);
  process.exit(1);
});
