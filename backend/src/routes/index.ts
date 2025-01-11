import { Request, Response } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import authMiddleware from '../middlewares/authMiddleware';

const injectRoutes = (app: any): void => {
  app.get('/stats', AppController.getStats);
  app.get('/status', AppController.getStatus);
  app.post('/register', UsersController.postNew);

  // authenticate users
  app.get('/login', AuthController.getConnect);
  app.get('/refresh-token', AuthController.refresh);
  app.get('/logout', AuthController.getDisconnect);
  app.get('/users/me', authMiddleware, UsersController.getMe);
};

export default injectRoutes;
