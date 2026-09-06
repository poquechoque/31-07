import { Request, Response, NextFunction } from 'express';
import { SeguimientoModel } from '../models/Seguimiento';
import { AdopcionModel } from '../models/Adopcion';
import { NotificacionModel } from '../models/Notificacion';
import ApiError from '../errors/ApiError';

export const crearSeguimiento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { adopcionId, tipo, estadoMascota, descripcion, observaciones, fotografias, proximoSeguimiento } = req.body;

    // Verificar adopción
    const adopcion = await AdopcionModel.findById(adopcionId)
      .populate({
        path: 'solicitud',
        populate: [
          { path: 'postulante', select: 'usuario' },
          { path: 'mascota', select: 'nombre' },
        ],
      });

    if (!adopcion) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Adopción no encontrada',
        code: 'ADOPCION_NOT_FOUND',
        status: 404,
      });
    }

    // Determinar rol del realizador
    const rolRealizador = req.user?.rol === 'administrador' ? 'admin' : 'oferente';

    const seguimiento = await SeguimientoModel.create({
      adopcion: adopcionId,
      tipo,
      estadoMascota,
      descripcion,
      observaciones,
      fotografias: fotografias || [],
      realizadoPor: userId,
      rolRealizador,
      proximoSeguimiento,
    });

    // Notificar al adoptante
    const postulante = (adopcion.solicitud as any).postulante;
    await NotificacionModel.create({
      usuario: postulante.usuario,
      tipo: 'seguimiento_nuevo',
      titulo: 'Nuevo seguimiento de adopción',
      mensaje: `Se ha registrado un seguimiento para ${(adopcion.solicitud as any).mascota.nombre}`,
      enlace: `/seguimientos/${seguimiento._id}`,
      prioridad: 'media',
    });

    res.status(201).json(seguimiento);
  } catch (error) {
    next(error);
  }
};

export const listarSeguimientos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adopcionId } = req.query;

    const filter: any = {};
    if (adopcionId) filter.adopcion = adopcionId;

    const seguimientos = await SeguimientoModel.find(filter)
      .populate('realizadoPor', 'nombreUsuario correo')
      .sort({ fechaSeguimiento: -1 });

    res.json(seguimientos);
  } catch (error) {
    next(error);
  }
};

export const obtenerSeguimiento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const seguimiento = await SeguimientoModel.findById(id)
      .populate('realizadoPor', 'nombreUsuario correo')
      .populate('adopcion');

    if (!seguimiento) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Seguimiento no encontrado',
        code: 'SEGUIMIENTO_NOT_FOUND',
        status: 404,
      });
    }

    res.json(seguimiento);
  } catch (error) {
    next(error);
  }
};