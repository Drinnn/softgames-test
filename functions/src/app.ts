import express, { type Express, type NextFunction, type Response, type Request } from 'express';
import morgan from 'morgan';
import router from './routes/index.js';
import { HttpError } from './classes/HttpError.js';

export const app: Express = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/', router);
app.use((_req, res, next) => {
  next(new HttpError('Path not found', 404));
});
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error('Received error:', err);
  if (err instanceof Error) {
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    res.status(statusCode).json({
      error: err.message,
    });
  } else if (typeof err === 'string') {
    res.status(500).json({
      error: err,
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});
