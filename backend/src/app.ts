import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoutes from './routes/searchRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Initialize environment variables
dotenv.config();

const app = express();

// Configure CORS for Next.js frontend calls
app.use(cors({
  origin: '*', // Dev permissive or configure for localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser configuration
app.use(express.json());

// Bind routes
app.use('/api', searchRoutes);
app.use('/api/auth', authRoutes);

// Base route / health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'Nexora AI Search Engine API',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err.message || err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

export default app;
