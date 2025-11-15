import React, { useEffect } from 'react';
import { useProductoStore } from '../store/useProductStore';
import { Itemproduct } from '../components/Itemproduct';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';

// style
import '../assets/styles/products.css';

const Productos: React.FC = () => {
  const productos = useProductoStore((state) => state.productos);
  const cargarProductos = useProductoStore((state) => state.cargarProductos);
  const cart = useOrderStore((state) => state.cart);

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="producto-container producto-layout mx-auto p-4">

      <div className="producto-container-header">
        <h1 className="color-primary">Nuestros Productos</h1>
        <button className='producto-button bg-button'>
          <Link to="/pedido" className="color-primary">
            Ir al Carrito ({cart.length})
          </Link>
        </button>
      </div>

      <section className='producto-container-list'>

        {productos.length > 0 ? (
          <Itemproduct productos={productos} />
        ) : (
          <div className='producto-load flex flex-col items-center justify-center h-64'>
            <div className='spinner'></div>
            <p className='color-primary mt-4'>Cargando productos...</p>
          </div>

        )}

      </section>

    </div>
  );
};

export default Productos;
