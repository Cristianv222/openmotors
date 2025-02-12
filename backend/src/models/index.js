import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database.js';

// Importar modelos individuales
import negocioModel from './negocio.model.js';
import usuarioModel from './usuario.model.js';

// Inicializar modelos
const Negocio = negocioModel(sequelize, Sequelize.DataTypes);
const Usuario = usuarioModel(sequelize, Sequelize.DataTypes);

// Configurar relaciones entre modelos
Negocio.associate = (models) => {
  Negocio.hasMany(Usuario, { foreignKey: 'negocio_id' });
};

Usuario.associate = (models) => {
  Usuario.belongsTo(Negocio, { foreignKey: 'negocio_id' });
};

// Agregar todos los modelos a un objeto
const db = {
  Negocio,
  Usuario,
  sequelize,
  Sequelize
};

// Exportar modelos y conexión
export default db;
export { Negocio, Usuario };