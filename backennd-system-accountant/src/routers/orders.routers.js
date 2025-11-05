const { Router } = require('express');
const router = Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  resetOrders
} = require('../controllers/orders.controllers.js');

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


module.exports = router;
