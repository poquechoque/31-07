import { Request, Response, NextFunction } from 'express';
import ApiError from '../errors/ApiError';

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
      throw new ApiError({
        name: 'UNAUTHORIZED',
        message: 'No autenticado',
        code: 'NOT_AUTHENTICATED',
        status: 401,
      });
    }

    if (!roles.includes(req.user.rol)) {
      throw new ApiError({
        name: 'FORBIDDEN',
        message: 'No tiene permisos para realizar esta acción',
        code: 'INSUFFICIENT_PERMISSIONS',
        status: 403,
      });
    }

    next();
  };
};

export const requireOferente = requireRole('oferente', 'administrador');
export const requireSolicitante = requireRole('solicitante', 'administrador');
export const requireAdmin = requireRole('administrador');