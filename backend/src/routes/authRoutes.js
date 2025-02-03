import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Ejemplo de ruta protegida
router.get('/perfil', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Acceso autorizado', 
    usuario: req.user 
  });
});

export default router;