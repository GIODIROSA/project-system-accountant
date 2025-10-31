const express = require('express');
const pool = require('./db'); // Importar la conexión a PostgreSQL
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Este es mi primer servidor en Node.js con Express');
});

// Ruta para probar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: '✅ Conexión exitosa a PostgreSQL',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).json({
      message: '❌ Error al conectar a PostgreSQL',
      error: error.message
    });
  }
});

// Endpoint de prueba para simular un pedido (notificará a N8N)
app.post('/api/pedidos-test', async (req, res) => {
  const { cliente, total, productos } = req.body;

  try {
    // Simular guardado de pedido (por ahora solo logging)
    console.log('Nuevo pedido recibido:', { cliente, total, productos });

    // Datos del pedido que enviaremos a N8N
    const pedidoData = {
      id: Math.floor(Math.random() * 1000), // ID temporal
      cliente,
      total,
      productos,
      fecha: new Date().toISOString()
    };

    // IMPORTANTE: Por ahora solo devolvemos el pedido
    // En el siguiente paso, agregaremos la llamada a N8N
    res.json({
      success: true,
      message: 'Pedido registrado (modo prueba)',
      pedido: pedidoData,
      nota: 'En el siguiente paso conectaremos con N8N'
    });

  } catch (error) {
    console.error('Error al procesar pedido:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint que N8N puede consultar para obtener datos de un pedido
app.get('/api/pedidos-test/:id', async (req, res) => {
  try {
    // Simular datos de un pedido
    const pedido = {
      id: req.params.id,
      cliente: 'Cliente Ejemplo',
      total: 250.50,
      productos: [
        { nombre: 'Producto A', cantidad: 2, precio: 100 },
        { nombre: 'Producto B', cantidad: 1, precio: 50.50 }
      ],
      fecha: new Date().toISOString()
    };

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
