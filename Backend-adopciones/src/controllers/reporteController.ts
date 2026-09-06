import { Request, Response, NextFunction } from 'express';
import { UsuarioModel } from '../models/Usuario';
import { MascotaModel } from '../models/Mascota';
import { SolicitudAdopcionModel } from '../models/SolicitudAdopcion';
import { AdopcionModel } from '../models/Adopcion';

export const estadisticasGenerales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsuarios, totalMascotas, totalSolicitudes, totalAdopciones] = await Promise.all([
      UsuarioModel.countDocuments({ estado: true }),
      MascotaModel.countDocuments({ estado: true }),
      SolicitudAdopcionModel.countDocuments(),
      AdopcionModel.countDocuments(),
    ]);

    const [mascotasDisponibles, mascotasAdoptadas, solicitudesPendientes] = await Promise.all([
      MascotaModel.countDocuments({ estado: true, estadoAdopcion: 'disponible' }),
      MascotaModel.countDocuments({ estado: true, estadoAdopcion: 'adoptado' }),
      SolicitudAdopcionModel.countDocuments({ estadoSolicitud: 'pendiente' }),
    ]);

    const usuariosPorRol = await UsuarioModel.aggregate([
      { $match: { estado: true } },
      { $group: { _id: '$rol', count: { $sum: 1 } } },
    ]);

    const adopcionesPorMes = await AdopcionModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$fechaAdopcion' },
            month: { $month: '$fechaAdopcion' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({
      totalUsuarios,
      totalMascotas,
      totalSolicitudes,
      totalAdopciones,
      mascotasDisponibles,
      mascotasAdoptadas,
      solicitudesPendientes,
      usuariosPorRol,
      adopcionesPorMes,
    });
  } catch (error) {
    next(error);
  }
};

export const reporteAdopciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fechaInicio, fechaFin, estado } = req.query;

    const filter: any = {};
    if (fechaInicio || fechaFin) {
      filter.fechaAdopcion = {};
      if (fechaInicio) filter.fechaAdopcion.$gte = new Date(fechaInicio as string);
      if (fechaFin) filter.fechaAdopcion.$lte = new Date(fechaFin as string);
    }
    if (estado) filter.estadoAdopcion = estado;

    const adopciones = await AdopcionModel.find(filter)
      .populate({
        path: 'solicitud',
        populate: [
          { path: 'postulante', select: 'nombres apellidos telefono correo' },
          { path: 'mascota', select: 'nombre tipoMascota raza sexo edadAproxMeses' },
        ],
      })
      .sort({ fechaAdopcion: -1 });

    res.json(adopciones);
  } catch (error) {
    next(error);
  }
};

export const reporteMascotas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { estadoAdopcion, tipoMascota } = req.query;

    const filter: any = { estado: true };
    if (estadoAdopcion) filter.estadoAdopcion = estadoAdopcion;
    if (tipoMascota) filter.tipoMascota = tipoMascota;

    const mascotas = await MascotaModel.find(filter)
      .populate('tipoMascota', 'nombreTipo')
      .populate('raza', 'nombreRaza')
      .populate('oferente', 'nombres apellidos telefono')
      .sort({ fechaRegistro: -1 });

    const total = mascotas.length;
    const porEstado = await MascotaModel.aggregate([
      { $match: { estado: true } },
      { $group: { _id: '$estadoAdopcion', count: { $sum: 1 } } },
    ]);

    res.json({
      total,
      porEstado,
      mascotas,
    });
  } catch (error) {
    next(error);
  }
};

export const reporteSolicitudes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { estadoSolicitud, fechaInicio, fechaFin } = req.query;

    const filter: any = {};
    if (estadoSolicitud) filter.estadoSolicitud = estadoSolicitud;
    if (fechaInicio || fechaFin) {
      filter.fechaSolicitud = {};
      if (fechaInicio) filter.fechaSolicitud.$gte = new Date(fechaInicio as string);
      if (fechaFin) filter.fechaSolicitud.$lte = new Date(fechaFin as string);
    }

    const solicitudes = await SolicitudAdopcionModel.find(filter)
      .populate('postulante', 'nombres apellidos telefono correo')
      .populate('mascota', 'nombre fotoPrincipal')
      .sort({ fechaSolicitud: -1 });

    const total = solicitudes.length;
    const porEstado = await SolicitudAdopcionModel.aggregate([
      { $group: { _id: '$estadoSolicitud', count: { $sum: 1 } } },
    ]);

    res.json({
      total,
      porEstado,
      solicitudes,
    });
  } catch (error) {
    next(error);
  }
};