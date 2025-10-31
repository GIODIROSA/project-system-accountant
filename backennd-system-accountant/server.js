const express = require('express');
const fetch = require('node-fetch');
const pool = require('./db'); // Importar la conexión a PostgreSQL
const app = express();
const port = process.env.PORT || 3000;

// URL del webhook de N8N (configurable via variable de entorno)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://matiasknd.app.n8n.cloud/webhook/nuevo-pedido';

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

    // Notificar a N8N sobre el nuevo pedido
    try {
      console.log('Notificando a N8N:', N8N_WEBHOOK_URL);
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
      });

      if (n8nResponse.ok) {
        console.log('✅ N8N notificado exitosamente');
      } else {
        console.error('⚠️ Error al notificar a N8N:', n8nResponse.status);
      }
    } catch (n8nError) {
      // No fallar si N8N no responde, solo loggear
      console.error('⚠️ No se pudo notificar a N8N:', n8nError.message);
    }

    res.json({
      success: true,
      message: 'Pedido registrado y N8N notificado',
      pedido: pedidoData
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
