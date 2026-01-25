import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import workerRoutes from './routes/workers.js';
import jobRoutes from './routes/jobs.js';
import adminRoutes from './routes/adminRoutes.js'; // Import admin routes

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware (higher limit for profile photo base64)
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes); // Use admin routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
