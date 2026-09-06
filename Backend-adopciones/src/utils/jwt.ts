import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

const JWT_SECRET = env.jwtSecret || 'secret-key';
const JWT_EXPIRES_IN = env.jwtExpiresIn || '7d';

export interface JwtPayload {
  id: string;
  correo: string;
  rol: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};