export type User = {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  createdAt: string;
};

export type UserCredentials = {
  email: string;
  password?: string;
};
