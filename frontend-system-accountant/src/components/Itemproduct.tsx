import React from 'react';
import type { Producto } from '../interface/interfaceProduct';

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
        <div key={producto.id_producto} className="border rounded-lg shadow-lg p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-2">{producto.nombre}</h2>
          <p className="text-gray-700 flex-grow">{producto.descrip}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">${producto.precio.toFixed(2)}</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              producto.stock > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}>
              Stock: {producto.stock}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};