import * as UserModel from '../models/userModel.js';
import { validateRegister, validateLogin } from '../utils/validation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    // Validar datos de entrada
    validateRegister(req.body);

    // Crear usuario
    const userId = await UserModel.createUser(req.body);

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      userId 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // Validar datos de inicio de sesión
    validateLogin(req.body);

    const { email, password, negocio_id } = req.body;

    // Buscar usuario
    const user = await UserModel.findUserByEmail(email, negocio_id);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        negocio_id: user.negocio_id 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};