import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { oauth2Client, SCOPES } from '../config/google';
import { getPrisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const SALT_ROUNDS = 10;

export class AuthController {
  getGoogleAuthUrl = async (_req: Request, res: Response): Promise<void> => {
    try {
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
      });
      res.json({ url });
    } catch (error) {
      logger.error('Error generating Google auth URL:', error);
      res.status(500).json({ error: 'Failed to generate auth URL' });
    }
  };

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        res.status(400).json({ error: 'Authorization code is required' });
        return;
      }

      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = (await import('googleapis')).google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      const prisma = getPrisma();

      let user = await prisma.user.findUnique({ where: { googleId: userInfo.id! } });

      if (!user) {
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
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            accessToken: tokens.access_token || null,
            refreshToken: tokens.refresh_token || null
          }
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' as any }
      );

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

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: 'Email, password, and name are required' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }

      const prisma = getPrisma();

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await prisma.user.create({
        data: { email, name, password: hashedPassword, googleId: email }
      });

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

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const prisma = getPrisma();

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      if (user.password) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          res.status(401).json({ error: 'Invalid email or password' });
          return;
        }
      }

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

  getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      logger.error('Get me error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  };
}
