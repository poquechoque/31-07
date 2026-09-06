import { Request, Response, NextFunction } from 'express';
import { UsuarioModel } from '../models/Usuario';
import { OferenteModel } from '../models/Oferente';
import { PostulanteModel } from '../models/Postulante';
import { MascotaModel } from '../models/Mascota';
import { SolicitudAdopcionModel } from '../models/SolicitudAdopcion';
import ApiError from '../errors/ApiError';

// ============================================
// GESTIÓN DE USUARIOS
// ============================================

export const listarUsuarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarios = await UsuarioModel.find()
      .select('-contrasena')  
      .sort({ fechaRegistro: -1 });

    // Obtener perfiles adicionales
    const usuariosConPerfil = await Promise.all(
      usuarios.map(async (usuario) => {
        let perfil = null;
        if (usuario.rol === 'oferente') {
          perfil = await OferenteModel.findOne({ usuario: usuario._id });
        } else if (usuario.rol === 'solicitante') {
          perfil = await PostulanteModel.findOne({ usuario: usuario._id });
        }
        return {
          ...usuario.toObject(),
          perfil,
        };
      })
    );

    res.json(usuariosConPerfil);
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // true o false

    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND',
        status: 404,
      });
    }

    // No permitir desactivar al propio admin
    if (usuario._id.toString() === req.user?.id && usuario.rol === 'administrador') {
      throw new ApiError({
        name: 'FORBIDDEN',
        message: 'No puedes desactivar tu propio usuario',
        code: 'CANNOT_DEACTIVATE_SELF',
        status: 403,
      });
    }

    usuario.estado = estado;
    await usuario.save();

    res.json({ message: `Usuario ${estado ? 'activado' : 'desactivado'}`, usuario });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GESTIÓN DE MASCOTAS (Admin)
// ============================================

export const listarTodasMascotas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { estadoAdopcion, tipoMascota } = req.query;

    const filter: any = {};
    if (estadoAdopcion) filter.estadoAdopcion = estadoAdopcion;
    if (tipoMascota) filter.tipoMascota = tipoMascota;

    const mascotas = await MascotaModel.find(filter)
      .populate('tipoMascota', 'nombreTipo')
      .populate('raza', 'nombreRaza')
      .populate('oferente', 'nombres apellidos telefono')
      .sort({ fechaRegistro: -1 });

    res.json(mascotas);
  } catch (error) {
    next(error);
  }
};

// ============================================
// GESTIÓN DE SOLICITUDES (Admin)
// ============================================

export const listarTodasSolicitudes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { estadoSolicitud } = req.query;

    const filter: any = {};
    if (estadoSolicitud) filter.estadoSolicitud = estadoSolicitud;

    const solicitudes = await SolicitudAdopcionModel.find(filter)
      .populate('postulante', 'nombres apellidos telefono correo')
      .populate('mascota', 'nombre fotoPrincipal')
      .populate('oferente', 'nombres apellidos')
      .sort({ fechaSolicitud: -1 });

    res.json(solicitudes);
  } catch (error) {
    next(error);
  }
};