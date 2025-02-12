import express from 'express';
import { sequelize, testConnection } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

// Configurar entorno
dotenv.config();

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a DB
await testConnection();

// Rutas
app.use('/api/auth', authRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});