export interface Producto {
  id_producto: number;
  nombre: string;
  descrip: string;
  precio: string;
  stock: number;
  activo: boolean;
  createdAt: string;
}

export interface ProductoStore {
  productos: Producto[];
  cargarProductos: () => void;
}
