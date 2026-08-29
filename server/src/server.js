import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { seedDatabase } from './db/seed.js';

// Import route modules
import authRoutes from './routes/authRoutes.js';
import quotesRoutes from './routes/quotesRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Request logger for development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Digitway API',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/notifications', notificationsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : undefined,
  });
});

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Initialize database seed & start server
seedDatabase();

app.listen(config.port, () => {
  console.log(`\n======================================================`);
  console.log(`🟢 Digitway Server running on http://localhost:${config.port}`);
  console.log(`🔐 Admin Email configured: ${config.adminEmail}`);
  console.log(`📱 Telegram Bot Alert: ${config.telegram.botToken ? 'Configured' : 'Dev Simulation Mode'}`);
  console.log(`======================================================\n`);
});
