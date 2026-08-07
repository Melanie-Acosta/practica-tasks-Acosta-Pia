import express from 'express';
import dotenv from 'dotenv';
import sequelize from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import taskRoutes from './src/routes/task.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', taskRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con la base de datos MySQL establecida correctamente.');

    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas correctamente con la base de datos.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
  }
};

startServer();