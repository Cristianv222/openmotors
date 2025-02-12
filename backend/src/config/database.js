import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false,
      freezeTableName: true
    },
    dialectOptions: {
      decimalNumbers: true,
      dateStrings: true,
      typeCast: true
    },
    timezone: '-05:00' // Ajustar según tu zona horaria
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados');
    }
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error.message);
    process.exit(1);
  }
};

// Manejadores de eventos de conexión
sequelize
  .authenticate()
  .then(() => {
    sequelize.connectionManager.initPools();
    
    sequelize.connectionManager.on('release', (connection) => {
      console.log('Conexión %d liberada', connection.threadId);
    });
  })
  .catch(err => {
    console.error('Error al inicializar el pool de conexiones:', err);
  });

// Exportar modelos y sequelize
export { 
  sequelize,
  testConnection
};