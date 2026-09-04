// auth.controller.ts - Handles user authentication operations
// Supports both email/password registration and Google OAuth 2.0 login

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { oauth2Client, SCOPES } from '../config/google';
import { getPrisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

// Number of salt rounds for bcrypt password hashing (higher = more secure but slower)
const SALT_ROUNDS = 10;

export class AuthController {

  /**
   * GET /api/auth/google
   * Generates the Google OAuth consent screen URL
   * Frontend redirects user to this URL to authenticate with Google
   */
  getGoogleAuthUrl = async (_req: Request, res: Response): Promise<void> => {
    try {
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',   // Get refresh_token for long-lived access
        scope: SCOPES,            // Google Classroom + profile scopes
        prompt: 'consent'         // Force consent screen to ensure refresh_token is returned
      });
      res.json({ url });
    } catch (error) {
      logger.error('Error generating Google auth URL:', error);
      res.status(500).json({ error: 'Failed to generate auth URL' });
    }
  };

  /**
   * GET /api/auth/google/callback?code=...
   * Called by Google after user authorizes the app
   * Exchanges authorization code for tokens, creates/updates user, returns JWT
   */
  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        res.status(400).json({ error: 'Authorization code is required' });
        return;
      }

      // Exchange authorization code for access_token and refresh_token
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Fetch user info from Google
      const oauth2 = (await import('googleapis')).google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      const prisma = getPrisma();

      // Check if user already exists (by Google ID)
      let user = await prisma.user.findUnique({ where: { googleId: userInfo.id! } });

      if (!user) {
        // New user - create account with Google info
        user = await prisma.user.create({
          data: {
            email: userInfo.email!,
            name: userInfo.name!,
            avatar: userInfo.picture,
            googleId: userInfo.id!,
            accessToken: tokens.access_token || null,
            refreshToken: tokens.refresh_token || null
          }
        });
      } else {
        // Existing user - update tokens (refresh_token may change)
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            accessToken: tokens.access_token || null,
            refreshToken: tokens.refresh_token || null
          }
        });
      }

      // Generate JWT token (expires in 7 days)
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' as any }
      );

      // In production, redirect to frontend with token; in dev, return JSON
      if (process.env.NODE_ENV === 'production') {
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
      } else {
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
      }
    } catch (error) {
      logger.error('Google callback error:', error);
      if (process.env.NODE_ENV === 'production') {
        res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
      } else {
        res.status(500).json({ error: 'Google auth failed' });
      }
    }
  };

  /**
   * POST /api/auth/register
   * Creates a new user account with email and password
   * Password is hashed with bcrypt before storing
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      // Validate required fields
      if (!email || !password || !name) {
        res.status(400).json({ error: 'Email, password, and name are required' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }

      const prisma = getPrisma();

      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }

      // Hash password with bcrypt before storing
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user in database
      const user = await prisma.user.create({
        data: { email, name, password: hashedPassword, googleId: email }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' as any }
      );

      res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  };

  /**
   * POST /api/auth/login
   * Authenticates user with email and password
   * Compares password hash with bcrypt
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const prisma = getPrisma();

      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Verify password using bcrypt (handles Google-only users without password)
      if (user.password) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          res.status(401).json({ error: 'Invalid email or password' });
          return;
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' as any }
      );

      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  };

  /**
   * GET /api/auth/me
   * Returns the currently authenticated user's profile
   * Requires JWT token in Authorization header
   */
  getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      logger.error('Get me error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  };

  /**
   * POST /api/auth/logout
   * Logs out the user (JWT is stateless, so client just removes the token)
   */
  logout = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  };
}
