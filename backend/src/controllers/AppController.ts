import { Request, Response } from 'express';
import redisClient from '../utils/redis/redis';
import dbClient from '../utils/mongo/db';

export default class AppController {
  static getStatus(_req: Request, res: Response) {
    if (redisClient.isActive() && dbClient.isActive()) {
      return res.status(200).json({ redis: true, db: true });
    } else {
      return res
        .status(500)
        .json({ redis: redisClient.isActive(), db: dbClient.isActive() });
    }
  }

  static getStats(_req: Request, res: Response) {
    Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
      .then(([usersCount, filesCount]) => {
        return res.status(200).json({ users: usersCount, files: filesCount });
      })
      .catch((error) => {
        console.error('Error fetching stats:', error);
        return res.status(500).json({ error: 'Internal server error' });
      });
  }
}
