const express = require('express');
const pool = require('./db'); // Importar la conexión a PostgreSQL
const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
