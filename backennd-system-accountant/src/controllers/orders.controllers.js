import pool from '../db.js';
import fetch from 'node-fetch';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://matiasknd.app.n8n.cloud/webhook/nuevo-pedido';

// Controlador para crear un pedido
export const createOrder = async (req, res) => {
  const { cliente, total, productos } = req.body;

  try {
    if (!cliente || !total || !productos) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: cliente, total, productos'
      });
    }

    const result = await pool.query(
      'INSERT INTO pedidos (cliente, total, productos) VALUES ($1, $2, $3) RETURNING *',
      [cliente, total, JSON.stringify(productos)]
    );

    const pedidoGuardado = result.rows[0];

    const pedidoData = {
      id: pedidoGuardado.id,
      cliente: pedidoGuardado.cliente,
      total: parseFloat(pedidoGuardado.total),
      productos: pedidoGuardado.productos,
      fecha: pedidoGuardado.fecha
    };

    console.log('Pedido guardado en PostgreSQL con ID:', pedidoGuardado.id);

    // Notificar a N8N de forma asíncrona (sin esperar)
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoData)
    }).then(n8nResponse => {
      if (n8nResponse.ok) {
        console.log('N8N notificado exitosamente');
      } else {
        console.error('Error al notificar a N8N:', n8nResponse.status);
      }
    }).catch(n8nError => {
      console.error('No se pudo notificar a N8N:', n8nError.message);
    });

    res.status(201).json({
      success: true,
      message: 'Pedido guardado y notificación a N8N en proceso',
      pedido: pedidoData
    });

  } catch (error) {
    console.error('Error al procesar pedido:', error);
    res.status(500).json({
      error: error.message,
      hint: 'Verifica que la tabla "pedidos" exista en la base de datos'
    });
  }
};

// Controlador para listar todos los pedidos
export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY fecha DESC');

    const pedidos = result.rows.map(pedido => ({
      id: pedido.id,
      cliente: pedido.cliente,
      total: parseFloat(pedido.total),
      productos: pedido.productos,
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
};

// Controlador para obtener un pedido por ID
export const getOrderById = async (req, res) => {
  try {
    const pedidoId = req.params.id;
    const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [pedidoId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Pedido no encontrado',
        id: pedidoId
      });
    }

    const pedido = result.rows[0];
    const pedidoData = {
      id: pedido.id,
      cliente: pedido.cliente,
      total: parseFloat(pedido.total),
      productos: pedido.productos,
      fecha: pedido.fecha
    };

    res.json(pedidoData);
  } catch (error) {
    console.error('Error al consultar pedido:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controlador para eliminar un pedido por ID
export const deleteOrderById = async (req, res) => {
  try {
    const pedidoId = req.params.id;

    const result = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [pedidoId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Pedido no encontrado',
        id: pedidoId
      });
    }

    console.log('Pedido eliminado:', pedidoId);

    res.json({
      success: true,
      message: 'Pedido eliminado correctamente',
      id: pedidoId
    });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controlador para eliminar TODOS los pedidos
export const resetOrders = async (req, res) => {
  try {
    const deleteResult = await pool.query('DELETE FROM pedidos');
    await pool.query('ALTER SEQUENCE pedidos_id_seq RESTART WITH 1');

    console.log('Base de datos limpiada. Se eliminaron', deleteResult.rowCount, 'pedidos');
    console.log('Contador de IDs reiniciado a 1');

    res.json({
      success: true,
      message: 'Base de datos limpiada y contador reiniciado',
      deletedCount: deleteResult.rowCount
    });
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    res.status(500).json({ error: error.message });
  }
};