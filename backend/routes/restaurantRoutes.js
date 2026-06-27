import express from 'express';
import { getRestaurants, getRestaurantDetails, getCategories } from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurantDetails);
router.get('/categories', getCategories);

export default router;
