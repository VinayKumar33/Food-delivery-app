import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import restaurantRoutes from './routes/restaurantRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: "Welcome to Vinay's Heaven API",
    timestamp: new Date().toISOString()
  });
});

// Register restaurant routes
app.use('/api', restaurantRoutes);

// Centralized error handler middleware
app.use(errorHandler);

// Initialize DB and start server
const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database or start server:', error);
    process.exit(1);
  }
};

startServer();
