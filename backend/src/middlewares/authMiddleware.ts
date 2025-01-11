/* no-unused-vars */
/*no-ts*/

import { NextFunction, Request, Response } from 'express';
import redisClient from '../utils/redis/redis';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['x-token'];

  if (!token) {
    return res.status(401).json({ error: 'token not passed !!!' });
  }

  const userId = await redisClient.get(`auth_${token}`);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.userId = userId; // The middleware adds the userId to the request object using req.userId = userId;.
  next(); // tells the middleware to proceed to the next middleware in the chain.
};

export default authMiddleware;
