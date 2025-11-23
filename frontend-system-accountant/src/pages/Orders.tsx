import Modal from '../components/Modal';
import React, { useState } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { getUserByEmail } from '../services/userService';
import { useUserStore } from '../store/useUserStore';
import type { User } from '../types/Users';
import { Link } from 'react-router-dom';
import '../assets/styles/orders.css';


const UserCheck: React.FC<{ onUserFound: (user: User) => void; onUserNotFound: (email: string) => void }> = ({ onUserFound, onUserNotFound }) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const handleCheckUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setIsValidEmail(false);
      return;
    }
    const user = await getUserByEmail(trimmedEmail);
    if (user) {
      onUserFound(user);
    } else {
      onUserNotFound(trimmedEmail);
    }
  };

  return (
    <form onSubmit={handleCheckUser} className="order-form-user p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
      <h2 className="text-2xl font-bold mb-4">Verificar Usuario</h2>
      <div className="mb-4">
        <label className=" block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          className={`order-input-custom w-full p-2 border rounded ${!isValidEmail && email.length > 0 ? 'border-red-500' : ''}`}
          required
        />
        {!isValidEmail && email.length > 0 && (
          <p className="text-red-500 text-sm mt-1">Por favor, introduce un correo electrónico válido (ej. usuario@dominio.com)</p>
        )}
      </div>
      <button type="submit" className={`order-button-register text-white px-4 py-2 rounded ${!isValidEmail || email.length === 0 ? 'bg-gray-400 cursor-not-allowed' : ''}`} disabled={!isValidEmail || email.length === 0}>
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
  const [telefonoError, setTelefonoError] = useState<string | null>(null);
  const [telefonoWarning, setTelefonoWarning] = useState<string | null>(null);
  const { registerUser } = useUserStore();

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTelefono(value);

    // Clear previous errors/warnings
    setTelefonoError(null);
    setTelefonoWarning(null);

    const chilePhoneRegex = /^\+56\d{9}$/; // +56 followed by 9 digits
    const startsWithPlus56 = value.startsWith('+56');

    if (!startsWithPlus56 && value.length > 0) {
      setTelefonoWarning('El número de teléfono debe comenzar con +56.');
    }

    if (startsWithPlus56) {
      if (value.length > 12) { // +56 (3 chars) + 9 digits = 12 total
        setTelefonoError('El número de teléfono excede el límite de 9 dígitos después de +56.');
      } else if (!chilePhoneRegex.test(value) && value.length === 12) {
        setTelefonoError('Formato inválido. Debe ser +56 seguido de 9 dígitos.');
      }
    } else if (value.length > 12 && value.length > 0) { // If it doesn't start with +56 but is too long
      setTelefonoError('El número de teléfono es demasiado largo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (telefonoError) {
      return; // Prevent submission if there's an error
    }
    const newUser = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      telefono
    };
    await registerUser(newUser);
    const user = useUserStore.getState().user;
    if (user) {
      onUserCreated(user);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form-register p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
      <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>
      <div className="mb-4">
        <label className="order-label block text-gray-700">Nombre</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="order-input-custom w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="order-label block text-gray-700">Apellido</label>
        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className="order-input-custom w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="order-label block text-gray-700">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="order-input-custom w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="order-label block text-gray-700">Teléfono</label>
        <input
          type="tel"
          value={telefono}
          onChange={handleTelefonoChange}
          className={`order-input-custom w-full p-2 border rounded ${telefonoError ? 'border-red-500' : ''}`}
          required
        />
        {telefonoWarning && <span className="text-yellow-600 text-sm mt-1 block">{telefonoWarning}</span>}
        {telefonoError && <span className="text-red-500 text-sm mt-1 block">{telefonoError}</span>}
      </div>
      <button type="submit" className={`order-button-register text-white px-4 py-2 rounded ${telefonoError ? 'bg-gray-400 cursor-not-allowed' : ''}`} disabled={!!telefonoError}>
        Registrar
      </button>
    </form>
  );
};

const UserSection: React.FC = () => {
  const { user, setUser } = useUserStore();
  const [showUserForm, setShowUserForm] = useState(false);
  const [email, setEmail] = useState('');

  const handleUserFound = (foundUser: User) => {
    setUser(foundUser);
    setShowUserForm(false);
  };

  const handleUserNotFound = (email: string) => {
    setEmail(email);
    setShowUserForm(true);
  };

  if (user) {
    return (
      <div className="order-user-register bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
        <h2 className="text-2xl font-bold mb-4 color-primary">Usuario Registrado</h2>
        <p className='color-primary'>Nombre: {user.nombre} {user.apellido}</p>
        <p className='color-primary'>Email: {user.email}</p>
      </div>
    );
  }

  if (showUserForm) {
    return <UserForm onUserCreated={(createdUser) => {
      setUser(createdUser);
      setShowUserForm(false);
    }} initialEmail={email} />;
  }

  return <UserCheck onUserFound={handleUserFound} onUserNotFound={handleUserNotFound} />;
};

const Cart: React.FC<{ cart: any[], clearCart: () => void, createOrder: () => void, user: User | null }> = ({ cart, clearCart, createOrder, user }) => {
  const total = cart.reduce((acc, item) => acc + parseFloat(item.precio) * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="color-primary text-2xl font-bold mb-4">Carrito</h2>
      {cart.length === 0 ? (
        <p className='color-primary'>El carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id_producto} className="order-item-producto flex justify-between items-center mb-2">
                <span>{item.nombre} x {item.quantity}</span>
                <span>${(parseFloat(item.precio) * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr className="order-separador my-4" />
          <div className="flex justify-between items-center font-bold text-xl">
            <span className='color-primary'>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="order-button-container mt-4">
            <button onClick={clearCart} className="order-button-clear text-white px-4 py-2 rounded mr-2">
              Limpiar Carrito
            </button>
            <button onClick={createOrder} className={`text-white px-4 py-2 rounded ${!user ? 'order-button-unset cursor-not-allowed' : 'order-button-created'}`} disabled={!user}>
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
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleCreateOrder = async () => {
    if (!user) {
      setModalMessage('Por favor, verifica o registra un usuario antes de crear un pedido.');
      setIsModalOpen(true);
      return;
    }
    if (cart.length === 0) {
      setModalMessage('El carrito está vacío.');
      setIsModalOpen(true);
      return;
    }
    await addPedido(user, cart);
    setModalMessage('Pedido creado con éxito!');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  return (
    <div className="order-container order-layout mx-auto p-4">

      <section className="flex flex-col mb-6 order-gap-4">
        <h1 className="text-3xl font-bold mb-6">Crear Nuevo Pedido</h1>
        <div className="order-button bg-button">
          <Link to="/producto" className="color-primary">
            Volver a Productos
          </Link>
        </div>
      </section>

      <section className="order-section-container">

        <div>
          <UserSection />
        </div>

        <div>
          <Cart cart={cart} clearCart={clearCart} createOrder={handleCreateOrder} user={user} />
        </div>

      </section>

    

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <p>{modalMessage}</p>
        </Modal>

      


    </div>
  );
}