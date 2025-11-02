

export const getUsers = (req, res) => {
  res.send("Obteniendo usuarios de la DB...");
};

export const getUser = (req, res) => {
  const { id } = req.params;
  res.send(`Obteniendo usuario con ID: ${id}`);
};

export const createUser = (req, res) => {
  res.send("Creando un nuevo usuario...");
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  res.send(`Actualizando usuario con ID: ${id}`);
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  res.send(`Eliminando usuario con ID: ${id}`);
};