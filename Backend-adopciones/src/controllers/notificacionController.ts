import { Request, Response, NextFunction } from 'express';
import { NotificacionModel } from '../models/Notificacion';
import ApiError from '../errors/ApiError';

export const listarNotificaciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { leido } = req.query;

    const filter: any = { usuario: userId };
    if (leido !== undefined) filter.leido = leido === 'true';

    const notificaciones = await NotificacionModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    const noLeidas = await NotificacionModel.countDocuments({
      usuario: userId,
      leido: false,
    });

    res.json({
      notificaciones,
      noLeidas,
      total: notificaciones.length,
    });
  } catch (error) {
    next(error);
  }
};

export const marcarComoLeida = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notificacion = await NotificacionModel.findOne({ _id: id, usuario: userId });
    if (!notificacion) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Notificación no encontrada',
        code: 'NOTIFICACION_NOT_FOUND',
        status: 404,
      });
    }

    notificacion.leido = true;
    notificacion.fechaLectura = new Date();
    await notificacion.save();

    res.json({ message: 'Notificación marcada como leída', notificacion });
  } catch (error) {
    next(error);
  }
};

export const marcarTodasComoLeidas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    await NotificacionModel.updateMany(
      { usuario: userId, leido: false },
      { leido: true, fechaLectura: new Date() }
    );

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    next(error);
  }
};

export const eliminarNotificacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notificacion = await NotificacionModel.findOneAndDelete({ _id: id, usuario: userId });
    if (!notificacion) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Notificación no encontrada',
        code: 'NOTIFICACION_NOT_FOUND',
        status: 404,
      });
    }

    res.json({ message: 'Notificación eliminada' });
  } catch (error) {
    next(error);
  }
};