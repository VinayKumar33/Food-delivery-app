import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', process.env.DATABASE_PATH || 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper for running queries with async/await
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const initDb = async () => {
  // Create tables sequentially
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cuisine TEXT NOT NULL,
      rating REAL DEFAULT 4.0,
      delivery_time INTEGER DEFAULT 30,
      cost_for_two INTEGER DEFAULT 300,
      distance REAL DEFAULT 1.0,
      delivery_fee INTEGER DEFAULT 0,
      image_url TEXT,
      promo_text TEXT,
      address TEXT,
      is_active INTEGER DEFAULT 1
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      is_veg INTEGER DEFAULT 1,
      is_best_seller INTEGER DEFAULT 0,
      category TEXT,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      restaurant_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'placed',
      delivery_address TEXT NOT NULL,
      payment_method TEXT DEFAULT 'COD',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
    )
  `);

  console.log('Database tables initialized.');

  // Seeding initial data if table is empty
  const resCount = await get('SELECT COUNT(*) as count FROM restaurants');
  if (resCount.count === 0) {
    console.log('Seeding initial restaurant and menu data...');
    
    const restaurantsData = [
      {
        name: 'The Golden Kitchen',
        cuisine: 'North Indian, Mughlai, Biryani',
        rating: 4.3,
        delivery_time: 25,
        cost_for_two: 350,
        distance: 2.4,
        delivery_fee: 30,
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
        promo_text: '50% OFF up to ₹100',
        address: 'Sector 4, Dwarka, New Delhi'
      },
      {
        name: 'Green Leaf Pure Veg',
        cuisine: 'South Indian, Chinese, Fast Food',
        rating: 4.6,
        delivery_time: 18,
        cost_for_two: 250,
        distance: 1.2,
        delivery_fee: 0,
        image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60',
        promo_text: 'Free Delivery',
        address: 'Main Market, Sector 7, Rohini, Delhi'
      },
      {
        name: 'Burger & Co.',
        cuisine: 'Burgers, American, Beverages',
        rating: 4.1,
        delivery_time: 30,
        cost_for_two: 400,
        distance: 3.5,
        delivery_fee: 45,
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
        promo_text: 'Buy 1 Get 1 Free',
        address: 'Connaught Place, New Delhi'
      },
      {
        name: 'Noodle House',
        cuisine: 'Chinese, Asian, Thai',
        rating: 4.4,
        delivery_time: 22,
        cost_for_two: 300,
        distance: 1.8,
        delivery_fee: 20,
        image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60',
        promo_text: 'Flat ₹50 OFF',
        address: 'Defence Colony, New Delhi'
      },
      {
        name: 'Pizza Paradise',
        cuisine: 'Pizza, Italian, Fast Food',
        rating: 4.2,
        delivery_time: 35,
        cost_for_two: 500,
        distance: 4.2,
        delivery_fee: 40,
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
        promo_text: '20% OFF on ₹400+',
        address: 'Saket District Centre, New Delhi'
      },
      {
        name: 'Sweet Heaven',
        cuisine: 'Desserts, Ice Cream, Bakery',
        rating: 4.7,
        delivery_time: 15,
        cost_for_two: 200,
        distance: 0.8,
        delivery_fee: 15,
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
        promo_text: 'Flat ₹30 OFF',
        address: 'Greater Kailash 1, New Delhi'
      },
      {
        name: 'Hyd Biryani Club',
        cuisine: 'Biryani, Hyderabadi, Mughlai',
        rating: 4.5,
        delivery_time: 28,
        cost_for_two: 380,
        distance: 2.7,
        delivery_fee: 30,
        image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60',
        promo_text: '40% OFF up to ₹80',
        address: 'Karol Bagh, New Delhi'
      },
      {
        name: 'Healthy Bites',
        cuisine: 'Salads, Healthy Food, Juices',
        rating: 3.9,
        delivery_time: 20,
        cost_for_two: 300,
        distance: 2.1,
        delivery_fee: 25,
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
        promo_text: 'Free Delivery on ₹250+',
        address: 'Vasant Kunj, New Delhi'
      }
    ];

    const menuData = {
      'The Golden Kitchen': [
        { name: 'Special Chicken Biryani', description: 'Fragrant basmati rice layered with marinated chicken and rich spices. Served with raita.', price: 280, is_veg: 0, is_best_seller: 1, category: 'Biryani', image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=60' },
        { name: 'Butter Naan', description: 'Freshly baked tandoori bread glazed with fresh butter.', price: 40, is_veg: 1, is_best_seller: 0, category: 'Breads', image_url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=300&auto=format&fit=crop&q=60' },
        { name: 'Paneer Butter Masala', description: 'Soft paneer cubes simmered in a creamy, butter-infused tomato gravy.', price: 220, is_veg: 1, is_best_seller: 1, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=60' },
        { name: 'Chicken Tikka Masala', description: 'Tender grilled chicken pieces served in a thick, creamy tikka masala gravy.', price: 260, is_veg: 0, is_best_seller: 0, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=60' }
      ],
      'Green Leaf Pure Veg': [
        { name: 'Masala Dosa', description: 'Crispy rice crepe stuffed with spiced potato mash. Served with sambar and coconut chutney.', price: 90, is_veg: 1, is_best_seller: 1, category: 'South Indian', image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=60' },
        { name: 'Idli Combo (2 Pcs)', description: 'Steamed fluffy rice cakes served with sambar and fresh chutney.', price: 70, is_veg: 1, is_best_seller: 0, category: 'South Indian', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=60' },
        { name: 'Veg Chowmein', description: 'Stir-fried noodles loaded with crunchy vegetables and Chinese sauces.', price: 120, is_veg: 1, is_best_seller: 0, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=60' },
        { name: 'Gobi Manchurian Dry', description: 'Crispy cauliflower florets tossed in a tangy and spicy manchurian sauce.', price: 140, is_veg: 1, is_best_seller: 1, category: 'Starters', image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=60' }
      ],
      'Burger & Co.': [
        { name: 'Classic Veg Burger', description: 'Crispy potato patty with cheese slice, fresh lettuce, tomato, and house mayo.', price: 110, is_veg: 1, is_best_seller: 1, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=60' },
        { name: 'Crunchy Chicken Burger', description: 'Crispy batter-fried chicken breast with custom spicy dressing.', price: 150, is_veg: 0, is_best_seller: 1, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=60' },
        { name: 'Crispy French Fries', description: 'Golden crispy salted potato fries. Served with ketchup.', price: 90, is_veg: 1, is_best_seller: 0, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=60' },
        { name: 'Oreo Milkshake', description: 'Thick creamy milkshake blended with vanilla ice cream and Oreo cookies.', price: 130, is_veg: 1, is_best_seller: 0, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop&q=60' }
      ],
      'Noodle House': [
        { name: 'Chicken Hakka Noodles', description: 'Stir-fried noodles with shredded chicken and oriental greens.', price: 160, is_veg: 0, is_best_seller: 1, category: 'Noodles', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=60' },
        { name: 'Veg Fried Rice', description: 'Fluffy rice wok-tossed with fresh vegetables and light soy sauce.', price: 130, is_veg: 1, is_best_seller: 0, category: 'Rice', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&auto=format&fit=crop&q=60' },
        { name: 'Spring Rolls (4 Pcs)', description: 'Crispy rolls filled with seasoned sautéed vegetables. Served with sweet chilli dip.', price: 100, is_veg: 1, is_best_seller: 0, category: 'Starters', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=60' },
        { name: 'Chilli Paneer', description: 'Paneer cubes tossed with bell peppers and onions in spicy chilli sauce.', price: 180, is_veg: 1, is_best_seller: 1, category: 'Starters', image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=60' }
      ],
      'Pizza Paradise': [
        { name: 'Margherita Pizza (Medium)', description: 'Classic cheese and tomato base topped with fresh mozzarella and basil.', price: 199, is_veg: 1, is_best_seller: 1, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=60' },
        { name: 'Farmhouse Pizza (Medium)', description: 'Topped with mushrooms, golden corn, crisp bell peppers, and fresh tomatoes.', price: 299, is_veg: 1, is_best_seller: 1, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&auto=format&fit=crop&q=60' },
        { name: 'Garlic Breadsticks', description: 'Baked breadsticks brushed with garlic butter and herbs. Served with cheesy dip.', price: 129, is_veg: 1, is_best_seller: 0, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&auto=format&fit=crop&q=60' }
      ],
      'Sweet Heaven': [
        { name: 'Chocolate Fudge Cake Slice', description: 'Rich layered chocolate sponge cake filled and covered with chocolate fudge frosting.', price: 149, is_veg: 1, is_best_seller: 1, category: 'Cakes', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=60' },
        { name: 'Vanilla Ice Cream Cup', description: 'Classic smooth vanilla bean ice cream.', price: 69, is_veg: 1, is_best_seller: 0, category: 'Ice Cream', image_url: 'https://images.unsplash.com/photo-1570064937493-af55877f84ed?w=300&auto=format&fit=crop&q=60' },
        { name: 'Warm Brownie with Ice Cream', description: 'Fudgy warm chocolate brownie topped with vanilla ice cream and hot chocolate fudge.', price: 129, is_veg: 1, is_best_seller: 1, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=300&auto=format&fit=crop&q=60' }
      ],
      'Hyd Biryani Club': [
        { name: 'Hyd Special Chicken Biryani', description: 'Authentic Hyderabadi dum biryani with layered rice, chicken, and aromatic herbs.', price: 290, is_veg: 0, is_best_seller: 1, category: 'Biryani', image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=60' },
        { name: 'Veg Biryani', description: 'Layered basmati rice with mixed seasonal vegetables, paneer, and saffron.', price: 190, is_veg: 1, is_best_seller: 0, category: 'Biryani', image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=60' },
        { name: 'Double Ka Meetha', description: 'Traditional bread pudding dessert made with fried bread slices soaked in saffron milk.', price: 99, is_veg: 1, is_best_seller: 1, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&auto=format&fit=crop&q=60' }
      ],
      'Healthy Bites': [
        { name: 'Avocado Green Salad', description: 'Avocados, organic lettuce, cucumbers, cherry tomatoes tossed in lemon olive oil vinaigrette.', price: 180, is_veg: 1, is_best_seller: 1, category: 'Salads', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=60' },
        { name: 'Quinoa Protein Bowl', description: 'Boiled quinoa with chickpeas, diced cottage cheese, bell peppers, and honey lime dressing.', price: 220, is_veg: 1, is_best_seller: 1, category: 'Salads', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=60' },
        { name: 'Fresh Fruit Salad', description: 'Assorted seasonal fresh fruits with honey mint dressing.', price: 140, is_veg: 1, is_best_seller: 0, category: 'Salads', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=60' }
      ]
    };

    for (const res of restaurantsData) {
      const { id } = await run(
        'INSERT INTO restaurants (name, cuisine, rating, delivery_time, cost_for_two, distance, delivery_fee, image_url, promo_text, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [res.name, res.cuisine, res.rating, res.delivery_time, res.cost_for_two, res.distance, res.delivery_fee, res.image_url, res.promo_text, res.address]
      );
      
      const dishes = menuData[res.name] || [];
      for (const dish of dishes) {
        await run(
          'INSERT INTO menu_items (restaurant_id, name, description, price, image_url, is_veg, is_best_seller, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [id, dish.name, dish.description, dish.price, dish.image_url, dish.is_veg, dish.is_best_seller, dish.category]
        );
      }
    }
    console.log('Seeding completed successfully.');
  }
};

export default db;
