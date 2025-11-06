import pool from '../db.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM producto');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM producto WHERE id_producto = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { nombre, descrip, precio, stock, activo } = req.body;
    const result = await pool.query(
      'INSERT INTO producto (nombre, descrip, precio, stock, activo) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
      [nombre, descrip, precio, stock, activo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descrip, precio, stock, activo } = req.body;
    const result = await pool.query(
      'UPDATE producto SET nombre = $1, descrip = $2, precio = $3, stock = $4, activo = $5 WHERE id_producto = $6 RETURNING * ',
      [nombre, descrip, precio, stock, activo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM producto WHERE id_producto = $1 RETURNING * ', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
