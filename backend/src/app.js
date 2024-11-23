// backend/src/app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import documentRoutes from './routes/documentRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Configure environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/documents', documentRoutes);

// Global error handler
app.use(errorHandler);

// Database connection
connectDB();

export default app;