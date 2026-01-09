import cors from 'cors';
import bodyParser from 'body-parser';

const setupMiddleware = (app) => {
  app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(bodyParser.json());
};

export default setupMiddleware;
