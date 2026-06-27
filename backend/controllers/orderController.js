import { run, get, query } from '../config/db.js';

export const placeOrder = async (req, res) => {
  try {
    const { user_id = 1, restaurant_id, total_amount, delivery_address, payment_method, items } = req.body;

    if (!restaurant_id || !total_amount || !delivery_address || !items || items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Missing required order details' });
    }

    // Insert order
    const orderResult = await run(
      'INSERT INTO orders (user_id, restaurant_id, total_amount, delivery_address, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, restaurant_id, total_amount, delivery_address, payment_method || 'COD', 'placed']
    );
    
    const orderId = orderResult.id;

    // Insert order items
    for (const item of items) {
      await run(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        orderId,
        message: 'Order placed successfully'
      }
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error while placing order' });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const order = await get('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    const items = await query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    
    // Also fetch restaurant details for the tracking page
    const restaurant = await get('SELECT name, image_url FROM restaurants WHERE id = ?', [order.restaurant_id]);

    res.status(200).json({
      status: 'success',
      data: {
        ...order,
        restaurant,
        items
      }
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error while fetching order' });
  }
};
