import { run, get, query } from '../config/db.js';

// Helper to get restaurant ID for the logged in owner
const getRestId = async (ownerId) => {
  const res = await get('SELECT id FROM restaurants WHERE owner_id = ?', [ownerId]);
  return res ? res.id : null;
};

export const getStats = async (req, res) => {
  try {
    const restId = await getRestId(req.user.id);
    if (!restId) return res.status(404).json({ status: 'error', message: 'No restaurant found for this owner.' });

    // Today's revenue
    const revenueRes = await get("SELECT SUM(total_amount) as total FROM orders WHERE restaurant_id = ? AND status = 'delivered' AND date(created_at) = date('now')", [restId]);
    const revenue = revenueRes?.total || 0;

    // Pending orders
    const pendingRes = await get("SELECT COUNT(*) as count FROM orders WHERE restaurant_id = ? AND status IN ('placed', 'preparing', 'picked_up', 'on_the_way')", [restId]);
    const pendingOrders = pendingRes?.count || 0;

    // Completed orders
    const completedRes = await get("SELECT COUNT(*) as count FROM orders WHERE restaurant_id = ? AND status = 'delivered'", [restId]);
    const completedOrders = completedRes?.count || 0;

    // Popular items (Mocked for simplicity, or we can aggregate from order_items)
    const popularItems = await query(`
      SELECT m.name, SUM(oi.quantity) as sold 
      FROM order_items oi 
      JOIN menu_items m ON oi.menu_item_id = m.id 
      JOIN orders o ON oi.order_id = o.id 
      WHERE o.restaurant_id = ? 
      GROUP BY m.id 
      ORDER BY sold DESC LIMIT 4
    `, [restId]);

    res.status(200).json({ status: 'success', data: { revenue, pendingOrders, completedOrders, popularItems } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const restId = await getRestId(req.user.id);
    const orders = await query('SELECT * FROM orders WHERE restaurant_id = ? ORDER BY created_at DESC', [restId]);
    
    // Fetch items for each order
    for (const order of orders) {
      const items = await query(`
        SELECT oi.*, m.name 
        FROM order_items oi 
        JOIN menu_items m ON oi.menu_item_id = m.id 
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
      
      const user = await get('SELECT name, phone FROM users WHERE id = ?', [order.user_id]);
      order.customer = user;
    }
    
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ status: 'success', message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMenu = async (req, res) => {
  try {
    const restId = await getRestId(req.user.id);
    const menu = await query('SELECT * FROM menu_items WHERE restaurant_id = ?', [restId]);
    res.status(200).json({ status: 'success', data: menu });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addFood = async (req, res) => {
  try {
    const restId = await getRestId(req.user.id);
    const { name, description, price, image_url, category, is_veg = 1 } = req.body;
    
    const result = await run(
      'INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category, is_veg) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [restId, name, description, price, image_url, category, is_veg]
    );
    
    res.status(201).json({ status: 'success', data: { id: result.id, name, description, price, image_url, category, is_veg } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const editFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category, is_veg } = req.body;
    
    await run(
      'UPDATE menu_items SET name=?, description=?, price=?, image_url=?, category=?, is_veg=? WHERE id=?',
      [name, description, price, image_url, category, is_veg, id]
    );
    
    res.status(200).json({ status: 'success', message: 'Item updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM menu_items WHERE id=?', [id]);
    res.status(200).json({ status: 'success', message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const restId = await getRestId(req.user.id);
    const profile = await get('SELECT * FROM restaurants WHERE id = ?', [restId]);
    res.status(200).json({ status: 'success', data: profile });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const restId = await getRestId(req.user.id);
    const { name, cuisine, delivery_time, cost_for_two, delivery_fee, image_url, address } = req.body;
    
    await run(
      'UPDATE restaurants SET name=?, cuisine=?, delivery_time=?, cost_for_two=?, delivery_fee=?, image_url=?, address=? WHERE id=?',
      [name, cuisine, delivery_time, cost_for_two, delivery_fee, image_url, address, restId]
    );
    
    res.status(200).json({ status: 'success', message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getReviews = async (req, res) => {
  // Mocked reviews
  res.status(200).json({
    status: 'success',
    data: [
      { id: 1, customer_name: 'Rahul S.', rating: 5, comment: 'Amazing food, delivered hot and fresh!', date: '2023-10-12' },
      { id: 2, customer_name: 'Priya M.', rating: 4, comment: 'Good taste but slightly delayed.', date: '2023-10-11' },
      { id: 3, customer_name: 'Amit K.', rating: 5, comment: 'The biryani was heavenly.', date: '2023-10-10' }
    ]
  });
};
