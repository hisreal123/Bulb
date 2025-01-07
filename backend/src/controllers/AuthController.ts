import { Request, Response } from 'express';
import redisClient from '../utils/redis/redis';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/mongo/db';
import bcrypt from 'bcrypt';

class AuthController {
  static async getConnect(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existUser = await dbClient.client
        .db()
        .collection('users')
        .findOne({ email });

      if (!existUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existUser.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Password not correct' });
      }

      const accessToken = uuidv4();
      const refreshToken = uuidv4();

      await redisClient.set(
        `auth_${accessToken}`,
        existUser._id.toString(),
        24 * 60 * 60
      ); // access token expires in 24 hours
      await redisClient.set(
        `refresh_${refreshToken}`,
        existUser._id.toString(),
        7 * 2 * 60 * 60
      ); // Refresh token expires in 7 days

      const currentEmail = existUser.email;

      res.status(200).json({ email: currentEmail, accessToken, refreshToken });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Missing refresh token' });
      }

      const userId = await redisClient.get(`refresh_${refreshToken}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const newAccedssToken = uuidv4();

      await redisClient.set(`auth_${newAccedssToken}`, userId, 15 * 60); //
      res.status(200).json({ accessToken: newAccedssToken });
    } catch (error) {
      console.log('Error getting refresh token:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // disconnect || sign out
  static async getDisconnect(req: Request, res: Response) {
    try {
      const token = req.headers['x-token'] as string;

      if (!token) {
        return res.status(400).json({ error: 'Missing token' });
      }

      const user = await redisClient.get(`auth_${token}`);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await redisClient.del(`auth_${token}`);
      console.log(`${user} signed out`);
      return res.status(200).json({ message: 'Signed out !!' });
    } catch (error) {
      console.error('Error during sign out:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;
