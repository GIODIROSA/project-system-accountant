import React, { useEffect } from 'react';
import { useProductoStore } from '../store/useProductStore';
import { Itemproduct } from '../components/Itemproduct';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';

const Productos: React.FC = () => {
  const productos = useProductoStore((state) => state.productos);
  const cargarProductos = useProductoStore((state) => state.cargarProductos);
  const cart = useOrderStore((state) => state.cart);

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nuestros Productos</h1>
        <Link to="/pedido" className="bg-blue-500 text-white px-4 py-2 rounded">
          Ir al Carrito ({cart.length})
        </Link>
      </div>
      {productos.length > 0 ? (
        <Itemproduct productos={productos} />
      ) : (
        <p>Cargando productos...</p>
      )}
    </div>
  );
};

export default Productos;
