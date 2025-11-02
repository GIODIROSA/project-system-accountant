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

// ENDPOINT TEMPORAL: Inicializar la base de datos
// ⚠️ ELIMINAR DESPUÉS DE USAR (solo se usa una vez)
app.get('/init-db', async (req, res) => {
  try {
    console.log('🔧 Inicializando base de datos...');

    // Crear tabla de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        cliente VARCHAR(255) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        productos JSONB NOT NULL,
        fecha TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Tabla "pedidos" creada correctamente');

    // Verificar que la tabla existe
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'pedidos'
    `);

    // Mostrar estructura de la tabla
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pedidos'
      ORDER BY ordinal_position
    `);

    res.json({
      success: true,
      message: '✅ Base de datos inicializada correctamente',
      tabla: result.rows.length > 0 ? 'pedidos creada' : 'error',
      estructura: columns.rows,
      nota: 'IMPORTANTE: Elimina este endpoint después de usarlo por seguridad'
    });

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    res.status(500).json({
      error: error.message,
      hint: 'Verifica que DATABASE_URL esté configurado correctamente'
    });
  }
});

// Endpoint para crear un pedido (guarda en PostgreSQL y notifica a N8N)
app.post('/api/pedidos-test', async (req, res) => {
  const { cliente, total, productos } = req.body;

  try {
    // Validar datos requeridos
    if (!cliente || !total || !productos) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: cliente, total, productos'
      });
    }

    console.log('Nuevo pedido recibido:', { cliente, total, productos });

    // Guardar el pedido en PostgreSQL
    const result = await pool.query(
      'INSERT INTO pedidos (cliente, total, productos) VALUES ($1, $2, $3) RETURNING *',
      [cliente, total, JSON.stringify(productos)]
    );

    // Obtener el pedido guardado con su ID real
    const pedidoGuardado = result.rows[0];

    // Preparar datos para N8N
    const pedidoData = {
      id: pedidoGuardado.id, // ID real de PostgreSQL
      cliente: pedidoGuardado.cliente,
      total: parseFloat(pedidoGuardado.total),
      productos: JSON.parse(pedidoGuardado.productos),
      fecha: pedidoGuardado.fecha
    };

    console.log('✅ Pedido guardado en PostgreSQL con ID:', pedidoGuardado.id);

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
      message: 'Pedido guardado en la base de datos y N8N notificado',
      pedido: pedidoData
    });

  } catch (error) {
    console.error('Error al procesar pedido:', error);
    res.status(500).json({
      error: error.message,
      hint: 'Verifica que la tabla "pedidos" exista en la base de datos'
    });
  }
});

// Endpoint para listar todos los pedidos
app.get('/api/pedidos-test', async (req, res) => {
  try {
    // Consultar todos los pedidos ordenados por fecha descendente
    const result = await pool.query(
      'SELECT * FROM pedidos ORDER BY fecha DESC'
    );

    // Parsear los productos de cada pedido
    const pedidos = result.rows.map(pedido => ({
      id: pedido.id,
      cliente: pedido.cliente,
      total: parseFloat(pedido.total),
      productos: JSON.parse(pedido.productos),
      fecha: pedido.fecha
    }));

    res.json({
      total: pedidos.length,
      pedidos: pedidos
    });
  } catch (error) {
    console.error('Error al listar pedidos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un pedido específico por ID
app.get('/api/pedidos-test/:id', async (req, res) => {
  try {
    const pedidoId = req.params.id;

    // Consultar el pedido en PostgreSQL
    const result = await pool.query(
      'SELECT * FROM pedidos WHERE id = $1',
      [pedidoId]
    );

    // Verificar si el pedido existe
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Pedido no encontrado',
        id: pedidoId
      });
    }

    // Obtener el pedido y parsear los productos
    const pedido = result.rows[0];
    const pedidoData = {
      id: pedido.id,
      cliente: pedido.cliente,
      total: parseFloat(pedido.total),
      productos: JSON.parse(pedido.productos),
      fecha: pedido.fecha
    };

    res.json(pedidoData);
  } catch (error) {
    console.error('Error al consultar pedido:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para eliminar un pedido
app.delete('/api/pedidos-test/:id', async (req, res) => {
  try {
    const pedidoId = req.params.id;

    // Verificar si el pedido existe antes de eliminar
    const checkResult = await pool.query(
      'SELECT * FROM pedidos WHERE id = $1',
      [pedidoId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Pedido no encontrado',
        id: pedidoId
      });
    }

    // Eliminar el pedido
    await pool.query('DELETE FROM pedidos WHERE id = $1', [pedidoId]);

    console.log('🗑️ Pedido eliminado:', pedidoId);

    res.json({
      success: true,
      message: 'Pedido eliminado correctamente',
      id: pedidoId
    });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
