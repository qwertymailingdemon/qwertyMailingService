import { Request, Response, NextFunction } from 'express';

export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.SERVICE_API_KEY;

  if (!validApiKey) {
    console.error('CRITICAL: SERVICE_API_KEY is not set in environment variables');
    return res.status(500).json({
      success: false,
      error: 'Internal server configuration error',
    });
  }

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing API key',
    });
  }

  next();
};