import React from 'react';
import type { Producto } from '../interface/interfaceProduct';
import { useOrderStore } from '../store/useOrderStore';
import '../assets/styles/products.css';
import '../assets/styles/global.css';

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
    <div key={producto.id_producto} className="producto-card">

      <section className='producto-title-descrip'>
        <h2 className="text-xl font-bold mb-2 color-primary">{producto.nombre}</h2>
        <p className="text-gray-700 flex-grow color-primary">{producto.descrip}</p>
      </section>

      <div className="mt-4 flex justify-between items-center">

        <div className="producto-button-added space-x-2">
          <button
            onClick={handleDecrease}
            className="producto-button-decrease"
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="producto-button-increase"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
