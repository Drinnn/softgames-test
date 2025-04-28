import { Response } from 'express';
import { ZodError } from 'zod';
import { HttpError, ServiceError } from '../entities';

export const successResponse = (res: Response, data: any, status = 200) => {
  return res.status(status).json(data);
};

export const errorResponse = (res: Response, error: unknown) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    });
  }
  
  if (error instanceof ServiceError) {
    return res.status(400).json({
      message: error.message
    });
  }
  
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message
    });
  }
  
  console.error('Unhandled error:', error);
  return res.status(500).json({
    message: 'Internal server error'
  });
}; 