import 'dotenv/config'
import cors from 'cors';
import express from 'express';
import ordersRouter from './routers/orders.routers.js';
import usersRouter from './routers/users.routers.js';
import productsRouter from './routers/products.routers.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

const corsOptions = {
  origin: ['https://frontend-system-accountant.onrender.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

// CORS
app.use(cors(corsOptions))

// Rutas base
app.get('/', (req, res) => {
  res.send('API del sistema de contabilidad');
});

// Usar los enrutadores
app.use('/api/pedido', ordersRouter);
app.use('/api/usuario', usersRouter);
app.use('/api/producto', productsRouter);


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});