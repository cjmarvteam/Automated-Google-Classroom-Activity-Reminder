import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { oauth2Client, SCOPES } from '../config/google';
import { environment } from '../config/environment';
import { User } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';

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

      let user = await User.findOne({ googleId: userInfo.id });
      
      if (!user) {
        user = await User.create({
          email: userInfo.email!,
          name: userInfo.name!,
          avatar: userInfo.picture,
          googleId: userInfo.id!,
          googleTokens: tokens
        });
      } else {
        user.googleTokens = tokens as any;
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        environment.JWT_SECRET,
        { expiresIn: environment.JWT_EXPIRES_IN }
      );

      res.redirect(`${environment.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      logger.error('Google callback error:', error);
      res.redirect(`${environment.FRONTEND_URL}/auth/error`);
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }

      const user = await User.create({ email, name, password, googleId: email });
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        environment.JWT_SECRET,
        { expiresIn: environment.JWT_EXPIRES_IN }
      );

      res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        environment.JWT_SECRET,
        { expiresIn: environment.JWT_EXPIRES_IN }
      );

      res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
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