import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { environment } from './config/environment';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
import { logger } from './utils/logger.util';

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: environment.FRONTEND_URL, credentials: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;