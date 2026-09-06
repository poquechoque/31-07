import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import ApiError from '../errors/ApiError';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError({
        name: 'UNAUTHORIZED',
        message: 'Token no proporcionado',
        code: 'TOKEN_MISSING',
        status: 401,
      });
    }


    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ [AUTH] Error:', error);
    next(error);
  }
};