import { Request, Response, NextFunction } from 'express';
import { RazaModel } from '../models/Raza';
import { MascotaModel } from '../models/Mascota';
import ApiError from '../errors/ApiError';

export const crearRaza = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipoMascota, nombreRaza, descripcion } = req.body;

    const existente = await RazaModel.findOne({ tipoMascota, nombreRaza });
    if (existente) {
      throw new ApiError({
        name: 'CONFLICT',
        message: 'La raza ya existe para este tipo de mascota',
        code: 'RAZA_EXISTS',
        status: 409,
      });
    }

    const raza = await RazaModel.create({ tipoMascota, nombreRaza, descripcion });
    res.status(201).json(raza);
  } catch (error) {
    next(error);
  }
};

export const listarRazas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipoMascota } = req.query;
    const filter: any = { estado: true };
    if (tipoMascota) filter.tipoMascota = tipoMascota;

    const razas = await RazaModel.find(filter).populate('tipoMascota', 'nombreTipo');
    res.json(razas);
  } catch (error) {
    next(error);
  }
};

export const actualizarRaza = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombreRaza, descripcion } = req.body;

    const raza = await RazaModel.findByIdAndUpdate(
      id,
      { nombreRaza, descripcion },
      { new: true, runValidators: true }
    );

    if (!raza) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Raza no encontrada',
        code: 'RAZA_NOT_FOUND',
        status: 404,
      });
    }

    res.json(raza);
  } catch (error) {
    next(error);
  }
};

export const eliminarRaza = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const mascotas = await MascotaModel.findOne({ raza: id, estado: true });
    if (mascotas) {
      throw new ApiError({
        name: 'CONFLICT',
        message: 'No se puede eliminar la raza porque tiene mascotas asociadas',
        code: 'RAZA_HAS_MASCOTAS',
        status: 409,
      });
    }

    const raza = await RazaModel.findByIdAndUpdate(id, { estado: false }, { new: true });
    if (!raza) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Raza no encontrada',
        code: 'RAZA_NOT_FOUND',
        status: 404,
      });
    }

    res.json({ message: 'Raza eliminada', raza });
  } catch (error) {
    next(error);
  }
};