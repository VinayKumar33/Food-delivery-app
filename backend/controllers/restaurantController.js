import { query, get } from '../config/db.js';

// Get all distinct food categories
export const getCategories = async (req, res, next) => {
  try {
    const rows = await query('SELECT DISTINCT category FROM menu_items WHERE category IS NOT NULL');
    const categories = rows.map(r => r.category);
    
    // Add emojis mapping for a premium visual touch
    const emojiMap = {
      'Biryani': '🍲',
      'South Indian': '🥞',
      'Burgers': '🍔',
      'Chinese': '🥢',
      'Starters': '🌯',
      'Pizzas': '🍕',
      'Ice Cream': '🍨',
      'Desserts': '🍰',
      'Salads': '🥗',
      'Main Course': '🥘',
      'Breads': '🍞',
      'Beverages': '🥤',
      'Sides': '🍟',
      'Cakes': '🎂'
    };

    const formattedCategories = categories.map(cat => ({
      name: cat,
      icon: emojiMap[cat] || '🍲'
    }));

    res.status(200).json({
      success: true,
      data: formattedCategories
    });
  } catch (err) {
    next(err);
  }
};

// Get list of restaurants with flexible filters
export const getRestaurants = async (req, res, next) => {
  try {
    const { search, veg, rating, section } = req.query;
    
    let sql = 'SELECT * FROM restaurants WHERE is_active = 1';
    const params = [];

    // Search filter
    if (search) {
      sql += ' AND (name LIKE ? OR cuisine LIKE ? OR id IN (SELECT DISTINCT restaurant_id FROM menu_items WHERE name LIKE ? OR description LIKE ?))';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    // Pure Veg filter
    if (veg === 'true') {
      // Find restaurants that ONLY have veg menu items or explicitly flagged
      // For simplicity in schema, let's filter if cuisine includes 'Veg' or name includes 'Veg' or rating > 4.5 for mock
      sql += ' AND (name LIKE "%Veg%" OR cuisine LIKE "%Veg%" OR id IN (SELECT DISTINCT restaurant_id FROM menu_items WHERE is_veg = 1 GROUP BY restaurant_id HAVING MIN(is_veg) = 1))';
    }

    // Rating filter (4.3+ for Top Rated)
    if (rating === 'true') {
      sql += ' AND rating >= 4.3';
    }

    // Section specific shortcuts
    if (section === 'top_rated') {
      sql += ' AND rating >= 4.3';
    } else if (section === 'nearby') {
      sql += ' AND distance <= 2.2';
    } else if (section === 'trending') {
      sql += ' AND rating >= 4.3 OR promo_text LIKE "%50%%"';
    }

    const restaurants = await query(sql, params);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (err) {
    next(err);
  }
};

// Get single restaurant menu
export const getRestaurantDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await get('SELECT * FROM restaurants WHERE id = ?', [id]);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const menuItems = await query('SELECT * FROM menu_items WHERE restaurant_id = ?', [id]);

    res.status(200).json({
      success: true,
      data: {
        ...restaurant,
        menu: menuItems
      }
    });
  } catch (err) {
    next(err);
  }
};
