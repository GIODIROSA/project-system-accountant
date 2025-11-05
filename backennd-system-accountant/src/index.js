require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Importar enrutadores
const ordersRouter = require('./routers/orders.routers.js');
// Aquí puedes importar más enrutadores, por ejemplo: 
// const usersRouter = require('./routers/users.routers.js');

// Middleware para parsear JSON
app.use(express.json());

// Rutas base
app.get('/', (req, res) => {
  res.send('API del sistema de contabilidad');
});

// Usar los enrutadores
app.use('/api/pedidos-test', ordersRouter);
// app.use('/api/users', usersRouter);


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});