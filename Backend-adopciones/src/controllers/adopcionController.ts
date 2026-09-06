import { Request, Response, NextFunction } from 'express';
import { AdopcionModel } from '../models/Adopcion';
import { SolicitudAdopcionModel } from '../models/SolicitudAdopcion';
import { MascotaModel } from '../models/Mascota';
import { NotificacionModel } from '../models/Notificacion';
import { OferenteModel } from '../models/Oferente';
import { PostulanteModel } from '../models/Postulante';
import ApiError from '../errors/ApiError';
import { Types } from 'mongoose';

// ============================================
// TIPOS PARA POPULATE (para evitar errores de TypeScript)
// ============================================

import { IMascota } from '../models/Mascota';
import { IPostulante } from '../models/Postulante';
import { IOferente } from '../models/Oferente';
import { ISolicitudAdopcion } from '../models/SolicitudAdopcion';
import { IAdopcion } from '../models/Adopcion';

// Tipo para Solicitud con Postulante poblado
type SolicitudConPostulante = ISolicitudAdopcion & {
  postulante: IPostulante;
};

// Tipo para Solicitud con Mascota poblada
type SolicitudConMascota = ISolicitudAdopcion & {
  mascota: IMascota;
};

// Tipo para Solicitud con ambos poblados
type SolicitudConPopulate = ISolicitudAdopcion & {
  postulante: IPostulante;
  mascota: IMascota;
};

// Tipo para Solicitud con Mascota y Oferente poblados
type SolicitudConMascotaYOferente = ISolicitudAdopcion & {
  mascota: IMascota & {
    oferente: IOferente;
  };
};

// Tipo para Solicitud con Postulante (para misAdopciones)
type SolicitudConPostulanteYUsuario = ISolicitudAdopcion & {
  postulante: IPostulante;
};

// Tipo para Adopcion con Solicitud poblada
type AdopcionConSolicitud = IAdopcion & {
  solicitud: SolicitudConPopulate;
};

// ============================================
// CONTROLLERS
// ============================================

export const registrarAdopcion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { solicitudId, condicionesAdopcion, compromisoFirmado, fechaEntrega } = req.body;

    // Verificar que la solicitud existe y está aprobada
    const solicitud = await SolicitudAdopcionModel.findById(solicitudId)
      .populate<{ postulante: IPostulante }>('postulante')
      .populate<{ mascota: IMascota }>('mascota');

    if (!solicitud) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Solicitud no encontrada',
        code: 'SOLICITUD_NOT_FOUND',
        status: 404,
      });
    }

    if (solicitud.estadoSolicitud !== 'aprobada') {
      throw new ApiError({
        name: 'CONFLICT',
        message: 'La solicitud debe estar aprobada para registrar la adopción',
        code: 'SOLICITUD_NO_APROBADA',
        status: 409,
      });
    }

    // Verificar que el usuario sea admin o el oferente de la mascota
    if (req.user?.rol !== 'administrador') {
      // Buscar el oferente de la mascota
      const mascotaConOferente = await MascotaModel.findById(solicitud.mascota._id)
        .populate<{ oferente: IOferente }>('oferente');

      if (!mascotaConOferente) {
        throw new ApiError({
          name: 'NOT_FOUND',
          message: 'Mascota no encontrada',
          code: 'MASCOTA_NOT_FOUND',
          status: 404,
        });
      }

      const oferenteUsuario = mascotaConOferente.oferente.usuario;
      if (oferenteUsuario.toString() !== userId) {
        throw new ApiError({
          name: 'FORBIDDEN',
          message: 'No tiene permisos para registrar esta adopción',
          code: 'NOT_OWNER',
          status: 403,
        });
      }
    }

    // Verificar que la adopción no exista
    const adopcionExistente = await AdopcionModel.findOne({ solicitud: solicitudId });
    if (adopcionExistente) {
      throw new ApiError({
        name: 'CONFLICT',
        message: 'Ya existe una adopción para esta solicitud',
        code: 'ADOPCION_EXISTENTE',
        status: 409,
      });
    }

    // Obtener oferente y solicitante
    const oferente = await OferenteModel.findOne({ usuario: userId });
    const postulante = await PostulanteModel.findById(solicitud.postulante._id);

    if (!oferente || !postulante) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Oferente o solicitante no encontrado',
        code: 'USER_NOT_FOUND',
        status: 404,
      });
    }

    // Crear adopción
    const adopcion = await AdopcionModel.create({
      solicitud: solicitudId,
      mascota: solicitud.mascota._id,
      oferente: oferente._id,
      solicitante: postulante._id,
      fechaAdopcion: fechaEntrega || new Date(),
      compromisoFirmado: compromisoFirmado || false,
      condicionesAdopcion,
      estadoAdopcion: 'activa',
    });

    // Actualizar estado de la mascota
    await MascotaModel.findByIdAndUpdate(solicitud.mascota._id, { 
      estadoAdopcion: 'adoptado',
      fechaAdopcion: new Date()
    });

    // Notificar al solicitante (postulante)
    await NotificacionModel.create({
      usuario: postulante.usuario,
      tipo: 'adopcion_registrada',
      titulo: '¡Adopción registrada!',
      mensaje: `La adopción de ${solicitud.mascota.nombre} ha sido registrada exitosamente`,
      enlace: `/adopciones/${adopcion._id}`,
      prioridad: 'alta',
    });

    // Notificar al oferente
    await NotificacionModel.create({
      usuario: userId,
      tipo: 'adopcion_registrada',
      titulo: '¡Adopción registrada!',
      mensaje: `La adopción de ${solicitud.mascota.nombre} ha sido registrada exitosamente`,
      enlace: `/adopciones/${adopcion._id}`,
      prioridad: 'media',
    });

    res.status(201).json(adopcion);
  } catch (error) {
    next(error);
  }
};

export const listarAdopciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adopciones = await AdopcionModel.find()
      .populate<{ solicitud: SolicitudConPopulate }>({
        path: 'solicitud',
        populate: [
          { path: 'postulante', select: 'nombres apellidos telefono' },
          { path: 'mascota', select: 'nombre fotoPrincipal' },
        ],
      })
      .sort({ fechaAdopcion: -1 });

    res.json(adopciones);
  } catch (error) {
    next(error);
  }
};

export const obtenerAdopcion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const adopcion = await AdopcionModel.findById(id)
      .populate<{ solicitud: SolicitudConMascotaYOferente }>({
        path: 'solicitud',
        populate: [
          { path: 'postulante', select: 'nombres apellidos telefono correo direccion' },
          { path: 'mascota', populate: ['tipoMascota', 'raza', 'oferente'] },
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

    res.json(adopcion);
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoAdopcion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { estadoAdopcion, observaciones } = req.body;

    if (!['activa', 'anulada', 'finalizada'].includes(estadoAdopcion)) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'Estado de adopción inválido',
        code: 'INVALID_ESTADO',
        status: 400,
      });
    }

    const adopcion = await AdopcionModel.findById(id);
    if (!adopcion) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Adopción no encontrada',
        code: 'ADOPCION_NOT_FOUND',
        status: 404,
      });
    }

    // Si se finaliza, cambiar estado de la mascota
    if (estadoAdopcion === 'finalizada') {
      await MascotaModel.findByIdAndUpdate(adopcion.mascota, { 
        estadoAdopcion: 'adoptado' 
      });
    }

    if (estadoAdopcion === 'anulada') {
      await MascotaModel.findByIdAndUpdate(adopcion.mascota, { 
        estadoAdopcion: 'disponible' 
      });
    }

    adopcion.estadoAdopcion = estadoAdopcion;
    if (observaciones) adopcion.observaciones = observaciones;
    await adopcion.save();

    res.json({ message: 'Estado de adopción actualizado', adopcion });
  } catch (error) {
    next(error);
  }
};

export const misAdopciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError({
        name: 'UNAUTHORIZED',
        message: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED',
        status: 401,
      });
    }

    // Buscar adopciones donde el usuario es oferente
    const oferente = await OferenteModel.findOne({ usuario: userId });
    const oferenteId = oferente?._id;

    // Buscar adopciones donde el usuario es solicitante (postulante)
    const postulante = await PostulanteModel.findOne({ usuario: userId });
    const postulanteId = postulante?._id;

    // Construir filtro
    const filter: any = {};

    if (oferenteId && postulanteId) {
      filter.$or = [
        { oferente: oferenteId },
        { solicitante: postulanteId }
      ];
    } else if (oferenteId) {
      filter.oferente = oferenteId;
    } else if (postulanteId) {
      filter.solicitante = postulanteId;
    } else {
      // Si no es oferente ni solicitante, devolver vacío
      return res.json([]);
    }

    const adopciones = await AdopcionModel.find(filter)
      .populate<{ solicitud: SolicitudConPostulanteYUsuario }>({
        path: 'solicitud',
        populate: [
          { path: 'postulante', select: 'nombres apellidos telefono correo' },
          { path: 'mascota', select: 'nombre fotoPrincipal tipoMascota raza' },
        ],
      })
      .populate('oferente', 'nombres apellidos telefono')
      .populate('solicitante', 'nombres apellidos telefono')
      .sort({ fechaAdopcion: -1 });

    res.json(adopciones);
  } catch (error) {
    next(error);
  }
};

export const eliminarAdopcion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const adopcion = await AdopcionModel.findById(id);
    if (!adopcion) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Adopción no encontrada',
        code: 'ADOPCION_NOT_FOUND',
        status: 404,
      });
    }

    // Devolver mascota a disponible
    await MascotaModel.findByIdAndUpdate(adopcion.mascota, { 
      estadoAdopcion: 'disponible' 
    });

    await AdopcionModel.findByIdAndDelete(id);

    res.json({ message: 'Adopción eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};