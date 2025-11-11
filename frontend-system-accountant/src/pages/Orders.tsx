import React, { useEffect, useState } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { useProductoStore } from '../store/useProductStore';
import { useUserStore } from '../store/useUserStore';
import { ProductCard } from '../components/ProductCard';
import type { User } from '../types/Users';

const UserCheck: React.FC<{ onUserFound: (user: User) => void; onUserNotFound: () => void }> = ({ onUserFound, onUserNotFound }) => {
  const [email, setEmail] = useState('');
  const { fetchUserByEmail, user } = useUserStore();

  const handleCheckUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchUserByEmail(email);
    if (user) {
      onUserFound(user);
    } else {
      onUserNotFound();
    }
  };

  return (
    <form onSubmit={handleCheckUser} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
      <h2 className="text-2xl font-bold mb-4">Verificar Usuario</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Verificar
      </button>
    </form>
  );
};

const UserForm: React.FC<{ onUserCreated: (user: User) => void, initialEmail?: string }> = ({ onUserCreated, initialEmail = '' }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [telefono, setTelefono] = useState('');
  const { registerUser, user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { nombre, apellido, email, telefono };
    await registerUser(newUser);
    if(user) {
      onUserCreated(user);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
      <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Nombre</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Apellido</label>
        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Teléfono</label>
        <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full p-2 border rounded" required />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Registrar
      </button>
    </form>
  );
};

const UserSection: React.FC = () => {
  const { user, fetchUserByEmail } = useUserStore();
  const [showUserForm, setShowUserForm] = useState(false);
  const [email, setEmail] = useState('');

  const handleUserFound = (foundUser: User) => {
    setShowUserForm(false);
  };

  const handleUserNotFound = () => {
    setShowUserForm(true);
  };

  if (user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Usuario Registrado</h2>
        <p>Nombre: {user.nombre} {user.apellido}</p>
        <p>Email: {user.email}</p>
      </div>
    );
  }

  if (showUserForm) {
    return <UserForm onUserCreated={() => setShowUserForm(false)} initialEmail={email} />;
  }

  return <UserCheck onUserFound={handleUserFound} onUserNotFound={handleUserNotFound} />;
};

const Cart: React.FC<{ cart: any[], clearCart: () => void, createOrder: () => void, user: User | null }> = ({ cart, clearCart, createOrder, user }) => {
  const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Carrito</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id_producto} className="flex justify-between items-center mb-2">
                <span>{item.nombre} x {item.quantity}</span>
                <span>${(item.precio * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between items-center font-bold text-xl">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={clearCart} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
              Limpiar Carrito
            </button>
            <button onClick={createOrder} className="bg-green-500 text-white px-4 py-2 rounded" disabled={!user}>
              Crear Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default function Orders() {
  const { cart, addPedido, clearCart } = useOrderStore();
  const { productos, cargarProductos } = useProductoStore();
  const { user } = useUserStore();

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleCreateOrder = async () => {
    if (!user) {
      alert('Por favor, verifica o registra un usuario antes de crear un pedido.');
      return;
    }
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    await addPedido(user, cart);
    alert('Pedido creado con éxito!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Pedido</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {productos.map(producto => (
              <ProductCard key={producto.id_producto} producto={producto} />
            ))}
          </div>
        </div>
        <div>
          <UserSection />
          <Cart cart={cart} clearCart={clearCart} createOrder={handleCreateOrder} user={user} />
        </div>
      </div>
    </div>
  );
}