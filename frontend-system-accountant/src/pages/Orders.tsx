import React, { useEffect, useState } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import type { Order } from '../types/Order';

const OrderForm: React.FC<{ order?: Order; onSave: (order: Omit<Order, 'id_pedido' | 'createdAt'> | Partial<Order>) => void; onCancel: () => void }> = ({ order, onSave, onCancel }) => {
  const [total, setTotal] = useState(order?.total || 0);
  const [estado, setEstado] = useState(order?.estado || 'pendiente');
  // Assuming a fixed user for simplicity
  const id_usario = 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      total: Number(total),
      estado: estado as Order['estado'],
      fecha_pedido: new Date().toISOString(),
      id_usario,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{order ? 'Editar Pedido' : 'Crear Pedido'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Total</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full p-2 border rounded">
              <option value="pendiente">Pendiente</option>
              <option value="procesado">Procesado</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function Orders() {
  const { orders, cargarPedidos, addPedido, updatePedido, deletePedido } = useOrderStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  const handleSave = async (orderData: Omit<Order, 'id_pedido' | 'createdAt'> | Partial<Order>) => {
    if (editingOrder) {
      await updatePedido(editingOrder.id_pedido, orderData);
    } else {
      await addPedido(orderData as Omit<Order, 'id_pedido' | 'createdAt'>);
    }
    setIsFormOpen(false);
    setEditingOrder(undefined);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      await deletePedido(id);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <button onClick={() => { setEditingOrder(undefined); setIsFormOpen(true); }} className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Pedido
        </button>
      </div>

      {isFormOpen && <OrderForm order={editingOrder} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingOrder(undefined); }} />}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Pedido</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id_pedido}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.id_pedido}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(order.fecha_pedido).toLocaleDateString()}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                    order.estado === 'completado' ? 'text-green-900' :
                    order.estado === 'cancelado' ? 'text-red-900' :
                    'text-yellow-900'
                  }`}>
                    <span aria-hidden className={`absolute inset-0 ${
                      order.estado === 'completado' ? 'bg-green-200' :
                      order.estado === 'cancelado' ? 'bg-red-200' :
                      'bg-yellow-200'
                    } opacity-50 rounded-full`}></span>
                    <span className="relative">{order.estado}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${order.total.toFixed(2)}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button onClick={() => handleEdit(order)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                  <button onClick={() => handleDelete(order.id_pedido)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}