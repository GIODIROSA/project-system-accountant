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
    <section className="">
      {productos.map((producto) => (
        console.log("Producto en Itemproduct:", producto),
        <ProductCard key={producto.id_producto} producto={producto} />
      ))}
    </section>
  );
};