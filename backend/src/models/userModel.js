import pool from '../config/database';
import bcrypt from 'bcryptjs';

export const createUser = async (userData) => {
  const { nombre, apellido, email, password, telefono, negocio_id } = userData;
  
  // Verificar si el usuario ya existe
  const [existingUsers] = await pool.execute(
    'SELECT * FROM USUARIOS WHERE email = ? AND negocio_id = ?', 
    [email, negocio_id]
  );

  if (existingUsers.length > 0) {
    throw new Error('El correo ya está registrado');
  }

  // Hashear contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insertar usuario
  const [result] = await pool.execute(
    `INSERT INTO USUARIOS 
    (nombre, apellido, email, password, telefono, negocio_id) 
    VALUES (?, ?, ?, ?, ?, ?)`, 
    [nombre, apellido, email, hashedPassword, telefono, negocio_id]
  );

  return result.insertId;
};

export const findUserByEmail = async (email, negocio_id) => {
  const [users] = await pool.execute(
    'SELECT * FROM USUARIOS WHERE email = ? AND negocio_id = ?', 
    [email, negocio_id]
  );
  return users[0];
};