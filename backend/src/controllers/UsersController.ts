import bcrypt from 'bcrypt';
import dbClient from '../utils/mongo/db';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { log } from 'console';

class UsersController {
  static async postNew(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
      }

      const existEmail = await dbClient.client
        .db()
        .collection('users')
        .findOne({ email });
      if (existEmail) {
        console.log('Email already exists !!');
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUser = await dbClient.client
        .db()
        .collection('users')
        .insertOne({ email, password: hashedPassword });

      const userId = insertUser.insertedId.toString();
      return res.status(201).json({ email, id: userId });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Retrieves a user object from the database using the provided userId.
   * @param userId - The ID of the user to retrieve.
   * @returns A promise that resolves to the user object containing id and email.
   */

  static async getMe(req: Request, res: Response) {
    try {
      const userId = req.userId; // takes the userId from the request object using req.userId.

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await dbClient.client
        .db()
        .collection('users')
        .findOne({ _id: new ObjectId(userId) }); // converts userId to an object id instance using new ObjectId(userId) b4 using it to query the database.

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res
        .status(200)
        .json({ id: user._id.toString(), email: user.email });
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw new Error('Internal Server Error');
    }
  }
}

export default UsersController;
