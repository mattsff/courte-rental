import express from 'express';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/users';
import bookingRoutes from './routes/bookings';
import cmsRoutes from './routes/cms';
import { auth } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Public routes
app.use('/api/users', userRoutes);

// Protected routes
app.use('/api/bookings', auth, bookingRoutes);
app.use('/api/cms', auth, cmsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});