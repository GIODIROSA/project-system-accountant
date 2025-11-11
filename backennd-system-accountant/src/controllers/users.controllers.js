import pool from '../db.js';

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario ORDER BY id_usuario ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener usuario ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email: rawEmail } = req.params;

    // Sanitizar: remover todos los espacios y convertir a minúsculas
    const sanitizedEmail = rawEmail.replace(/\s/g, '').toLowerCase();

    // Validar: verificar que el email contiene un '@'
    if (!sanitizedEmail.includes('@')) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    const result = await pool.query('SELECT * FROM usuario WHERE LOWER(email) = $1', [sanitizedEmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener usuario por email ${req.params.email}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createUser = async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  if (!nombre || !apellido || !email) {
    return res.status(400).json({ error: 'Los campos nombre, apellido y email son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO usuario (nombre, apellido, email, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, email, telefono]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Check for unique constraint violation
    if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya está en uso' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Los campos nombre, apellido y email son requeridos' });
    }

    const result = await pool.query(
      'UPDATE usuario SET nombre = $1, apellido = $2, email = $3, telefono = $4 WHERE id_usuario = $5 RETURNING *',
      [nombre, apellido, email, telefono, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar usuario ${req.params.id}:`, error);
    if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya está en uso' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuario WHERE id_usuario = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente', usuario: result.rows[0] });
  } catch (error) {
    console.error(`Error al eliminar usuario ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
