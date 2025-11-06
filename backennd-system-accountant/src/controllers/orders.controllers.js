import pool from '../db.js';
import fetch from 'node-fetch';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// Helper function to get a connection from the pool
const getClient = () => pool.connect();

/**
 * Crea un nuevo pedido.
 * Espera un cuerpo de solicitud como:
 * {
 *   "id_usuario": 1,
 *   "productos": [
 *     { "id_producto": 1, "cantidad": 2 },
 *     { "id_producto": 2, "cantidad": 1 }
 *   ]
 * }
 */
export const createOrder = async (req, res) => {
  const { id_usuario, productos } = req.body;

  if (!id_usuario || !productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Se requieren id_usuario y un array de productos.' });
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');

    // 1. Obtener precios de los productos y validar existencias
    const productIds = productos.map(p => p.id_producto);
    const pricesResult = await client.query(`SELECT id_producto, precio FROM producto WHERE id_producto = ANY($1::int[])`, [productIds]);

    if (pricesResult.rows.length !== productIds.length) {
        throw new Error('Uno o más productos no existen.');
    }

    const priceMap = new Map(pricesResult.rows.map(p => [p.id_producto, parseFloat(p.precio)]));

    // 2. Calcular el total y preparar los detalles del pedido
    let total = 0;
    const detallesParaInsertar = productos.map(p => {
      const precio_unitario = priceMap.get(p.id_producto);
      if (precio_unitario === undefined) {
        throw new Error(`Producto con id ${p.id_producto} no encontrado.`);
      }
      total += precio_unitario * p.cantidad;
      return {
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio_unitario: precio_unitario
      };
    });

    // 3. Insertar el pedido principal
    const pedidoResult = await client.query(
      'INSERT INTO pedido (id_usuario, total) VALUES ($1, $2) RETURNING id_pedido, fecha_pedido',
      [id_usuario, total]
    );
    const { id_pedido, fecha_pedido } = pedidoResult.rows[0];

    // 4. Insertar los detalles del pedido
    const insertPromises = detallesParaInsertar.map(d => {
        return client.query(
            'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
            [id_pedido, d.id_producto, d.cantidad, d.precio_unitario]
        );
    });
    await Promise.all(insertPromises);

    await client.query('COMMIT');

    // 5. Notificar a N8N (opcional, si la URL está configurada)
    if (N8N_WEBHOOK_URL) {
        const webhookPayload = {
            id_pedido,
            id_usuario,
            total,
            fecha_pedido,
            productos: detallesParaInsertar
        };
        fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload)
        }).catch(err => console.error('Error al notificar a N8N:', err.message));
    }

    res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente.',
        id_pedido: id_pedido
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el pedido.', details: error.message });
  } finally {
    client.release();
  }
};

const fullOrderQuery = `
    SELECT
        p.id_pedido,
        p.fecha_pedido,
        p.estado,
        p.total,
        json_build_object(
            'id_usuario', u.id_usuario,
            'nombre', u.nombre,
            'apellido', u.apellido,
            'email', u.email
        ) as usuario,
        (SELECT json_agg(
            json_build_object(
                'id_producto', pr.id_producto,
                'nombre', pr.nombre,
                'cantidad', dp.cantidad,
                'precio_unitario', dp.precio_unitario
            )
        )
        FROM detalle_pedido dp
        JOIN producto pr ON dp.id_producto = pr.id_producto
        WHERE dp.id_pedido = p.id_pedido
        ) as productos
    FROM pedido p
    JOIN usuario u ON p.id_usuario = u.id_usuario
`;

export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`${fullOrderQuery} ORDER BY p.fecha_pedido DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`${fullOrderQuery} WHERE p.id_pedido = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener pedido ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    // La tabla detalle_pedido tiene "ON DELETE CASCADE", por lo que los detalles se borrarán automáticamente.
    const result = await pool.query('DELETE FROM pedido WHERE id_pedido = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({ message: 'Pedido eliminado exitosamente', pedido: result.rows[0] });
  } catch (error) {
    console.error(`Error al eliminar pedido ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
