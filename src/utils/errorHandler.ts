import { Response } from 'express';

export const handleError = (res: Response, error: unknown, customMessage: string) => {
  console.error(error);
  res.status(400).json({ message: customMessage });
};