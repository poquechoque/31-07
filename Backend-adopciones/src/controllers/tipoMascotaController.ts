import { Request, Response, NextFunction } from 'express';
import { TipoMascotaModel } from '../models/TipoMascota';
import { MascotaModel } from '../models/Mascota';
import ApiError from '../errors/ApiError';

export const crearTipoMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombreTipo, descripcion } = req.body;

    const existente = await TipoMascotaModel.findOne({ nombreTipo });
    if (existente) {
      throw new ApiError({
        name: 'CONFLICT',
        message: 'El tipo de mascota ya existe',
        code: 'TIPO_MASCOTA_EXISTS',
        status: 409,
      });
    }

    const tipoMascota = await TipoMascotaModel.create({ nombreTipo, descripcion });
    res.status(201).json(tipoMascota);
  } catch (error) {
    next(error);
  }
};

export const listarTiposMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipos = await TipoMascotaModel.find({ estado: true });
    res.json(tipos);
  } catch (error) {
    next(error);
  }
};

export const actualizarTipoMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombreTipo, descripcion } = req.body;

    const tipoMascota = await TipoMascotaModel.findByIdAndUpdate(
      id,
      { nombreTipo, descripcion },
      { new: true, runValidators: true }
    );

    if (!tipoMascota) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Tipo de mascota no encontrado',
        code: 'TIPO_MASCOTA_NOT_FOUND',
        status: 404,
      });
    }

    res.json(tipoMascota);
  } catch (error) {
    next(error);
  }
};

export const eliminarTipoMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Verificar si tiene mascotas asociadas
    const mascotas = await MascotaModel.findOne({ tipoMascota: id, estado: true });
    if (mascotas) {
      throw new ApiError({
        name: 'CONFLICT',
        message: 'No se puede eliminar el tipo porque tiene mascotas asociadas',
        code: 'TIPO_MASCOTA_HAS_MASCOTAS',
        status: 409,
      });
    }

    const tipoMascota = await TipoMascotaModel.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!tipoMascota) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Tipo de mascota no encontrado',
        code: 'TIPO_MASCOTA_NOT_FOUND',
        status: 404,
      });
    }

    res.json({ message: 'Tipo de mascota eliminado', tipoMascota });
  } catch (error) {
    next(error);
  }
};