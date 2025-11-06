import { Router } from 'express';
const router = Router();

// Import controllers for the new relational schema
import { createOrder, getAllOrders, getOrderById, deleteOrderById } from '../controllers/orders.controllers.js';

// Get all orders and create a new order
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

// Get or delete a specific order by ID
router.route('/:id')
  .get(getOrderById)
  .delete(deleteOrderById);

export default router;