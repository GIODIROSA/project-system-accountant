const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Este es mi primer servidor en Node.js con Express');
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
