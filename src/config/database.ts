import mongoose from 'mongoose';
import { environment } from './environment';
import { logger } from '../utils/logger.util';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(environment.MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};