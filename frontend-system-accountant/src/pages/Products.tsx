import React, { useEffect } from 'react';
import { useProductoStore } from '../store/useProductStore';
import { Itemproduct } from '../components/Itemproduct';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';

// style
import '../assets/styles/products.css';
import '../assets/styles/global.css';

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
        <button className='producto-button'>
          <Link to="/pedido" className="">
            Ir al Carrito ({cart.length})
          </Link>
        </button>
      </div>

      <section>

        {productos.length > 0 ? (
          <Itemproduct productos={productos} />
        ) : (
          <p>Cargando productos...</p>
        )}

      </section>

    </div>
  );
};

export default Productos;
