import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

let prisma: PrismaClient;

export const connectDatabase = async (): Promise<PrismaClient> => {
  try {
    prisma = new PrismaClient();
    await prisma.$connect();
    logger.info('Database connected successfully');
    return prisma;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
};

export const getPrisma = (): PrismaClient => {
  if (!prisma) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return prisma;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
};
