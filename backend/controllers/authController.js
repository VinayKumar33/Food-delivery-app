import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { run, get } from '../config/db.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_jwt_key_vinays_heaven_123', {
    expiresIn: '90d'
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, address, role = 'customer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide name, email, and password.' });
    }

    const existingUser = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await run(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address, role]
    );

    const user = { id: result.id, name, email, phone, address, role };
    const token = signToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ status: 'error', message: 'Error creating user.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide email and password.' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Incorrect email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Incorrect email or password.' });
    }

    const token = signToken(user.id);
    // Remove password from response
    delete user.password;

    res.status(200).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Error logging in.' });
  }
};
