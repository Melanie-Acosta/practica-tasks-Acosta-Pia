import express from "express";
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Middlewares
app.use(express.json());

// Rutas de la API
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Iniciar servidor
const port = 4000;

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

export default app;
export default app;