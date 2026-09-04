// auth.middleware.ts - JWT authentication middleware
// Verifies the Bearer token in the Authorization header and attaches user to request
// Used on all protected routes (classrooms, activities, notifications, etc.)

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getPrisma } from '../config/database';
import { logger } from '../utils/logger';

// Extend Express Request to include userId and user data
export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

/**
 * authenticate - Middleware that verifies JWT token
 *
 * Flow:
 * 1. Extract token from Authorization: Bearer <token>
 * 2. Verify token using JWT_SECRET
 * 3. Look up user in database to ensure they still exist
 * 4. Attach userId and user to request for downstream handlers
 *
 * If any step fails, returns 401 Unauthorized
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify token and decode payload (contains userId and email)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Look up user in database (exclude sensitive fields like password, tokens)
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Attach user data to request object (accessible in route handlers as req.userId, req.user)
    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
