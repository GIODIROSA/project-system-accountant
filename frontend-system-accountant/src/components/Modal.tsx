import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`order-modal-interno transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        {children}
        <button onClick={onClose} className="order-button-pedido-realizado mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;
