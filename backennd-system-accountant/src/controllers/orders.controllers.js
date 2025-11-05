
export const getOrders = (req, res) => {
  res.send("Obteniendo pedido de la DB...");
};

export const getOrder = (req, res) => {
  const { id } = req.params;
  res.send(`Obteniendo pedido con ID: ${id}`);
};

export const createOrder = (req, res) => {
  res.send("Creando un nuevo pedido...");
};

export const updateOrder = (req, res) => {
  const { id } = req.params;
  res.send(`Actualizando pedido con ID: ${id}`);
};

export const deleteOrder = (req, res) => {
  const { id } = req.params;
  res.send(`Eliminando pedido con ID: ${id}`);
};