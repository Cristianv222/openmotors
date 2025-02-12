import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Usuario = sequelize.define('USUARIOS', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  // ... resto de campos según tu estructura
}, {
  tableName: 'USUARIOS',
  timestamps: false
});

export default Usuario;