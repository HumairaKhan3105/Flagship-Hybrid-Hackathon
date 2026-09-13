import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db.ts';
import instrumentRoutes from './server/routes/instrumentRoutes.ts';
import quizRoutes from './server/routes/quizRoutes.ts';
import { errorHandler } from './server/middleware/errorHandler.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to Database (with automatic fallback to in-memory store)
  await connectDB();

  // Serve static assets from public folder (e.g. /images/instruments/*)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ItihaasX API',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/instruments', instrumentRoutes);
  app.use('/api/quiz', quizRoutes);

  // Error Handler Middleware for API
  app.use(errorHandler);

  // Vite middleware for development or Static Serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎵 ItihaasX Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
