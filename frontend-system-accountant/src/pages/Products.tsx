import React, { useEffect } from 'react';
import { useProductoStore } from '../store/useProductStore';
import { Itemproduct } from '../components/itemproduct';

const Productos: React.FC = () => {
  const productos = useProductoStore((state) => state.productos);
  const cargarProductos = useProductoStore((state) => state.cargarProductos);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>
      {productos.length > 0 ? (
        <Itemproduct productos={productos} />
      ) : (
        <p>Cargando productos...</p>
      )}
    </div>
  );
};

export default Productos;
