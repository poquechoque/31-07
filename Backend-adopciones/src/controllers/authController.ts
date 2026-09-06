import { Request, Response, NextFunction } from 'express';
import { UsuarioModel } from '../models/Usuario';
import { OferenteModel } from '../models/Oferente';
import { PostulanteModel } from '../models/Postulante';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import ApiError from '../errors/ApiError';

export const registro = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombreUsuario, correo, contrasena, rol, ...datosPerfil } = req.body;

    const rolesPermitidos = ['oferente', 'solicitante', 'administrador'];
    if (!rolesPermitidos.includes(rol)) {
      throw new ApiError({
        name: 'VALIDATION_ERROR',
        message: 'Rol inválido. Debe ser oferente, solicitante o administrador',
        code: 'INVALID_ROLE',
        status: 400,
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await UsuarioModel.findOne({ correo });
    if (usuarioExistente) {
      throw new ApiError({
        name: 'CONFLICT',
        message: 'El correo ya está registrado',
        code: 'EMAIL_ALREADY_EXISTS',
        status: 409,
      });
    }

    // Hash de la contraseña
    const contrasenaHash = await hashPassword(contrasena);

    // Crear usuario
    const nuevoUsuario = await UsuarioModel.create({
      nombreUsuario,
      correo,
      contrasena: contrasenaHash,
      rol,
    });

    // Los administradores también tienen perfil de oferente
    if (rol === 'oferente' || rol === 'administrador') {
      await OferenteModel.create({
        usuario: nuevoUsuario._id,
        ...datosPerfil,
        correo,
      });
    } else if (rol === 'solicitante') {
      await PostulanteModel.create({
        usuario: nuevoUsuario._id,
        ...datosPerfil,
        correo,
      });
    }

    // Generar token
    const token = generateToken({
      id: nuevoUsuario._id.toString(),
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol,
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombreUsuario: nuevoUsuario.nombreUsuario,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario
    const usuario = await UsuarioModel.findOne({ correo }).select('+contrasena');
    if (!usuario) {
      throw new ApiError({
        name: 'UNAUTHORIZED',
        message: 'Credenciales incorrectas',
        code: 'INVALID_CREDENTIALS',
        status: 401,
      });
    }

    // Verificar estado
    if (!usuario.estado) {
      throw new ApiError({
        name: 'UNAUTHORIZED',
        message: 'Usuario inactivo',
        code: 'USER_INACTIVE',
        status: 401,
      });
    }

    // Verificar contraseña
    const passwordValida = await comparePassword(contrasena, usuario.contrasena);
    if (!passwordValida) {
      throw new ApiError({
        name: 'UNAUTHORIZED',
        message: 'Credenciales incorrectas',
        code: 'INVALID_CREDENTIALS',
        status: 401,
      });
    }

    // Generar token
    const token = generateToken({
      id: usuario._id.toString(),
      correo: usuario.correo,
      rol: usuario.rol,
    });

    // Actualizar último acceso
    await UsuarioModel.findByIdAndUpdate(usuario._id, { ultimoAcceso: new Date() });

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const perfil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = await UsuarioModel.findById(req.user?.id);
    if (!usuario) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND',
        status: 404,
      });
    }

    let perfil = null;
    if (usuario.rol === 'oferente') {
      perfil = await OferenteModel.findOne({ usuario: usuario._id });
    } else if (usuario.rol === 'solicitante') {
      perfil = await PostulanteModel.findOne({ usuario: usuario._id });
    }

    res.json({
      usuario: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        correo: usuario.correo,
        rol: usuario.rol,
        estado: usuario.estado,
        fechaRegistro: usuario.fechaRegistro,
      },
      perfil,
    });
  } catch (error) {
    next(error);
  }
};

export const cambiarContrasena = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contrasenaActual, nuevaContrasena } = req.body;

    const usuario = await UsuarioModel.findById(req.user?.id).select('+contrasena');
    if (!usuario) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND',
        status: 404,
      });
    }

    // Verificar contraseña actual
    const passwordValida = await comparePassword(contrasenaActual, usuario.contrasena);
    if (!passwordValida) {
      throw new ApiError({
        name: 'UNAUTHORIZED',
        message: 'Contraseña actual incorrecta',
        code: 'INVALID_CURRENT_PASSWORD',
        status: 401,
      });
    }

    // Hash nueva contraseña
    const nuevaContrasenaHash = await hashPassword(nuevaContrasena);
    usuario.contrasena = nuevaContrasenaHash;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    next(error);
  }
};