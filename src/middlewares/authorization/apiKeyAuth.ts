import { Request, Response, NextFunction } from 'express';
import { API_KEY } from '../../infra/constants';
import {
  API_KEY_IS_MISSING,
  API_KEY_IS_INVALID,
} from '../../utils/errorMessages';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: API_KEY_IS_MISSING });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({ message: API_KEY_IS_INVALID });
  }

  next();
}
