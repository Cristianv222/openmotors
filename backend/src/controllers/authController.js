import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Negocio, Usuario } from '../models/index.js';

const registrarNegocioYAdmin = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Crear negocio
    const negocio = await Negocio.create({
      nombre: req.body.nombre_negocio,
      direccion: req.body.direccion_negocio,
      telefono: req.body.telefono_negocio,
      ruc: req.body.ruc_negocio,
      logo: req.body.logo_negocio
    }, { transaction });

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const usuario = await Usuario.create({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      password: hashedPassword,
      telefono: req.body.telefono,
      negocio_id: negocio.id
    }, { transaction });

    // Asignar como administrador principal
    await NegocioAdministradores.create({
      negocio_id: negocio.id,
      usuario_id: usuario.id,
      es_principal: true
    }, { transaction });

    await transaction.commit();
    
    res.status(201).json({
      mensaje: 'Negocio y administrador registrados exitosamente',
      usuario: { id: usuario.id, email: usuario.email },
      negocio: { id: negocio.id, nombre: negocio.nombre }
    });
    
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

const loginUsuario = async (req, res) => {
  try {
    // Buscar negocio por RUC
    const negocio = await Negocio.findOne({ 
      where: { ruc: req.body.ruc_negocio } 
    });
    
    if (!negocio) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({
      where: { email: req.body.email, negocio_id: negocio.id }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(req.body.password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        usuarioId: usuario.id, 
        negocioId: negocio.id,
        email: usuario.email 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: 'admin' // Aquí deberías implementar la lógica de roles
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { registrarNegocioYAdmin, loginUsuario };