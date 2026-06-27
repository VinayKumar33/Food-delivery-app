import express from 'express';
import { placeOrder, getOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', placeOrder);
router.get('/:id', getOrder);

export default router;
