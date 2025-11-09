export type Order = {
  id_pedido: number;
  fecha_pedido: string;
  estado: 'pendiente' | 'procesado' | 'completado' | 'cancelado';
  total: number;
  id_usario: number;
  createdAt: string;
};
