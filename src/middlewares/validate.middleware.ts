import type { NextFunction, Request, RequestHandler, Response } from "express";

export function validate<T>(validator: (body: T) => void): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      validator(req.body as T);
      next();
    } catch (error) {
      next(error);
    }
  };
}
