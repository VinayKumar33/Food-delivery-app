import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  getStats, getOrders, updateOrderStatus,
  getMenu, addFood, editFood, deleteFood,
  getProfile, updateProfile, getReviews
} from '../controllers/dashboardController.js';

const router = express.Router();

// All dashboard routes must be accessed by authenticated restaurant owners
router.use(protect, restrictTo('restaurant'));

router.get('/stats', getStats);
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.route('/menu')
  .get(getMenu)
  .post(addFood);

router.route('/menu/:id')
  .put(editFood)
  .delete(deleteFood);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.get('/reviews', getReviews);

export default router;
