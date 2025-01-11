import express, { Request, Response } from 'express';
import injectRoutes from './routes';

const server = express();
const PORT = process.env.PORT || 5000;

// express.json() middleware
server.use(express.json());

// injected routes
injectRoutes(server);

server
  .get('/', (_req: Request, res: Response) => {
    res.send('Hello World !!');
  })
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
