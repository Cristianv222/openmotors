import { Router } from 'express';
import { registrarNegocioYAdmin, loginUsuario } from '../controllers/authController';

const router = Router();

router.post('/registro', registrarNegocioYAdmin);
router.post('/login', loginUsuario);

export default router;