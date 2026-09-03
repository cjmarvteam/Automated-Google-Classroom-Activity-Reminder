import { User } from '../models/user.model';
import { oauth2Client } from '../config/google';
import { logger } from '../utils/logger.util';

export class AuthService {
  async getUserById(userId: string) {
    return User.findById(userId).select('-googleTokens');
  }

  async getUserByGoogleId(googleId: string) {
    return User.findOne({ googleId });
  }

  async createUser(userData: any) {
    return User.create(userData);
  }

  async updateUserTokens(userId: string, tokens: any) {
    return User.findByIdAndUpdate(userId, { googleTokens: tokens }, { new: true });
  }

  async refreshAccessToken(userId: string): Promise<string | null> {
    try {
      const user = await User.findById(userId);
      if (!user || !user.googleTokens?.refresh_token) {
        return null;
      }

      oauth2Client.setCredentials({
        refresh_token: user.googleTokens.refresh_token
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      await this.updateUserTokens(userId, credentials);

      return credentials.access_token || null;
    } catch (error) {
      logger.error('Error refreshing access token:', error);
      return null;
    }
  }
}