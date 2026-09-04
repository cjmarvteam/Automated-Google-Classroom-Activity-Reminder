// server.ts - Main entry point for the Express backend server
// Initializes database connection, middleware, routes, and automation scheduler

import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { execSync } from 'child_process';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
import { logger } from './utils/logger';
import { ReminderScheduler } from './automation/reminderScheduler';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// helmet: Adds security headers (X-Content-Type-Options, X-Frame-Options, etc.)
app.use(helmet());

// cors: Allows frontend (running on different port) to make API requests
// credentials: true allows cookies/auth headers to be sent cross-origin
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// morgan: HTTP request logger - pipes to our custom logger
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
// All API routes are prefixed with /api (see routes/index.ts)
app.use('/api', routes);

// Health check endpoint for monitoring
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler - catches unhandled errors from all routes
app.use(errorHandler);

/**
 * Push Prisma schema to database
 * Creates tables if they don't exist
 */
const pushDatabase = (): void => {
  try {
    logger.info('Pushing database schema...');
    execSync('npx prisma db push --accept-data-loss --skip-generate', {
      stdio: 'inherit',
    });
    logger.info('Database schema pushed successfully');
  } catch (error) {
    logger.error('Failed to push database schema:', error);
  }
};

// --- Server Startup ---
const startServer = async () => {
  try {
    // Push schema to database (creates tables if missing)
    pushDatabase();

    // Connect to PostgreSQL via Prisma
    await connectDatabase();

    // Start the automation scheduler (daily reminders at 9AM, hourly overdue checks)
    const reminderScheduler = new ReminderScheduler();
    reminderScheduler.start();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info('Automation started - reminders will be sent daily at 9:00 AM');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
