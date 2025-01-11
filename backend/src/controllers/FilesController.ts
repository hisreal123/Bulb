import { Request, Response } from 'express';
import redisClient from '../utils/redis/redis';
import {
  isValidId,
  NULL_ID,
  ROOT_FOLDER_ID,
  VALID_FILE_TYPES,
} from '../global';
import dbClient from '../utils/mongo/db';
import mongoDBCore from 'mongodb/lib/core';

class FilesController {
  static async postUpload(req: Request, res: Response) {
    try {
      const token = req.headers['x-token'];
      const name = req.body ? req.body.name : null;
      const type = req.body ? req.body.type : null;
      const parentId =
        req.body && req.body.parentId ? req.body.parentId : ROOT_FOLDER_ID;
      const isPublic = req.body ? req.body.isPublic : false;
      const base64Data = req.body ? req.body.data : null;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }
      if (!type || !Object.entries(VALID_FILE_TYPES).includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }
      if (!req.body.data && type !== VALID_FILE_TYPES.folder) {
        return res.status(400).json({ error: 'Missing data' });
      }
      if (
        parentId !== ROOT_FOLDER_ID &&
        parentId !== ROOT_FOLDER_ID.toString()
      ) {
        const file = await (
          await dbClient.fileCollection()
        ).fineOne({
          _id: new mongoDBCore.BSON.ObjectId(
            isValidId(parentId) ? parentId : NULL_ID
          ),
        });

        if (!file) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (file.type !== VALID_FILE_TYPES.folder) {
          res.status(400).json({ error: 'Parent is not a folder' });
          return;
        }
      }
      const user = await redisClient.get(`auth_${token}`);
    } catch (error) {}
  }
}

export default FilesController;
