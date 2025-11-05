import { Router } from 'express';
const router = Router();

import { createOrder, getAllOrders, getOrderById, deleteOrderById, resetOrders } from '../controllers/orders.controllers.js';

// Ruta para obtener todos los pedidos y crear un nuevo pedido
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

// Ruta especial para resetear la base de datos
router.route('all/reset')
    .delete(resetOrders);

// Ruta para un pedido específico por ID
router.route('/:id')
  .get(getOrderById)
  .delete(deleteOrderById);


export default router;
