import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import ApiError from '../errors/ApiError';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw new ApiError({
      name: 'VALIDATION_ERROR',
      message: errorMessages,
      code: 'VALIDATION_FAILED',
      status: 400,
    });
  };
};

export const validacionesRegistro = [
  body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es obligatorio').isLength({ max: 50 }),
  body('correo').isEmail().withMessage('Email inválido'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['oferente', 'solicitante', 'administrador']).withMessage('Rol inválido'),
];

export const validacionesLogin = [
  body('correo').isEmail().withMessage('Email inválido'),
  body('contrasena').notEmpty().withMessage('La contraseña es obligatoria'),
];

export const validacionesMascota = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('tipoMascota').notEmpty().withMessage('El tipo de mascota es obligatorio'),
  body('raza').notEmpty().withMessage('La raza es obligatoria'),
  body('sexo').isIn(['macho', 'hembra']).withMessage('Sexo inválido'),
  body('edadAproxMeses').isNumeric().withMessage('La edad debe ser un número'),
  body('tamano').isIn(['pequeno', 'mediano', 'grande']).withMessage('Tamaño inválido'),
  body('color').notEmpty().withMessage('El color es obligatorio'),
  body('estadoSalud').notEmpty().withMessage('El estado de salud es obligatorio'),
];

export const validacionesSolicitud = [
  body('mascotaId').notEmpty().withMessage('La mascota es obligatoria'),
  body('motivoPostulacion').notEmpty().withMessage('El motivo de postulación es obligatorio'),
];