import React from 'react';
import type { Producto } from '../interface/interfaceProduct';
import { ProductCard } from './ProductCard';

interface ItemProductProps {
  productos: Producto[];
}

export const Itemproduct: React.FC<ItemProductProps> = ({ productos }) => {
  if (!productos || productos.length === 0) {
    return <p>No hay productos para mostrar.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {productos.map((producto) => (
        console.log("Producto en Itemproduct:", producto),
        <ProductCard key={producto.id_producto} producto={producto} />
      ))}
    </div>
  );
};