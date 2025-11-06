import 'dotenv/config'
import express from 'express';
import ordersRouter from './routers/orders.routers.js';
import usersRouter from './routers/users.routers.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas base
app.get('/', (req, res) => {
  res.send('API del sistema de contabilidad');
});

// Usar los enrutadores
app.use('/api/pedido', ordersRouter);
app.use('/api/users', usersRouter);


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});