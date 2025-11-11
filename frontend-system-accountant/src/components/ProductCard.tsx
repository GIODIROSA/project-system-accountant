import React from 'react';
import type { Producto } from '../interface/interfaceProduct';
import { useOrderStore } from '../store/useOrderStore';

interface ProductCardProps {
  producto: Producto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ producto }) => {
  const { cart, addToCart, removeFromCart } = useOrderStore();
  const cartItem = cart.find(item => item.id_producto === producto.id_producto);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleIncrease = () => {
    addToCart(producto);
  };

  const handleDecrease = () => {
    removeFromCart(producto.id_producto);
  };

  return (
    <div key={producto.id_producto} className="border rounded-lg shadow-lg p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-2">{producto.nombre}</h2>
      <p className="text-gray-700 flex-grow">{producto.descrip}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          producto.stock > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
        }`}>
          Stock: {producto.stock}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
