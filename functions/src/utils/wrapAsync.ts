import type { Request, Response, NextFunction } from 'express';

export function wrapAsync<T>(
  handler: (request: Request, response: Response) => Promise<T>,
): (req: Request, res: Response, next: NextFunction) => void {
  if (typeof handler !== 'function') {
    throw new Error('Provided handler must be a function');
  }

  const exec = async (request: Request, res: Response): Promise<T> => handler(request, res);

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      exec(req, res)
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err: unknown) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  };
}
