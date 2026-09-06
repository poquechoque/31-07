import { Request, Response, NextFunction } from 'express';
import { MascotaModel } from '../models/Mascota';
import { TipoMascotaModel } from '../models/TipoMascota';
import { RazaModel } from '../models/Raza';
import { OferenteModel } from '../models/Oferente';
import ApiError from '../errors/ApiError';
import fs from 'fs';


const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Helper para eliminar archivos
const eliminarArchivo = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
  }
};




export const crearMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const datos = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } || {};
    
    // Obtener URLs de las imágenes
    let fotoPrincipal = '';
    let fotografias: string[] = [];

    if (files.fotoPrincipal && files.fotoPrincipal[0]) {
      fotoPrincipal = `${BASE_URL}/uploads/${files.fotoPrincipal[0].filename}`;
    }

    if (files.fotografias) {
      fotografias = files.fotografias.map(file => `${BASE_URL}/uploads/${file.filename}`);
    }

    // Verificar que el usuario es oferente
    const oferente = await OferenteModel.findOne({ usuario: userId });
    if (!oferente) {
      throw new ApiError({
        name: 'FORBIDDEN',
        message: 'El usuario no es un oferente válido',
        code: 'NOT_OFFERENT',
        status: 403,
      });
    }

    // Verificar tipo de mascota
    const tipoMascota = await TipoMascotaModel.findById(datos.tipoMascota);
    if (!tipoMascota || !tipoMascota.estado) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Tipo de mascota no válido',
        code: 'INVALID_TIPO_MASCOTA',
        status: 404,
      });
    }

    // Verificar raza
    const raza = await RazaModel.findById(datos.raza);
    if (!raza || !raza.estado) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Raza no válida',
        code: 'INVALID_RAZA',
        status: 404,
      });
    }

    // Crear mascota
    const mascota = await MascotaModel.create({
      ...datos,
      oferente: oferente._id,
      fechaRegistro: new Date(),
      estadoAdopcion: datos.estadoAdopcion || 'borrador',
      fotoPrincipal: fotoPrincipal || datos.fotoPrincipal || '',
      fotografias: fotografias.length > 0 ? fotografias : (datos.fotografias || []),
    });

    res.status(201).json(mascota);
  } catch (error) {
    next(error);
  }
};
export const listarMascotas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipoMascota, raza, sexo, tamano, edadMin, edadMax, estadoAdopcion, busqueda } = req.query;

    const filter: any = { estado: true };

    if (estadoAdopcion) {
      filter.estadoAdopcion = estadoAdopcion;
    } else {
      filter.estadoAdopcion = 'disponible';
    }

    if (tipoMascota) filter.tipoMascota = tipoMascota;
    if (raza) filter.raza = raza;
    if (sexo) filter.sexo = sexo;
    if (tamano) filter.tamano = tamano;
    if (edadMin || edadMax) {
      filter.edadAproxMeses = {};
      if (edadMin) filter.edadAproxMeses.$gte = parseInt(edadMin as string);
      if (edadMax) filter.edadAproxMeses.$lte = parseInt(edadMax as string);
    }
    if (busqueda) {
      filter.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { color: { $regex: busqueda, $options: 'i' } },
      ];
    }

    const mascotas = await MascotaModel.find(filter)
      .populate('tipoMascota', 'nombreTipo')
      .populate('raza', 'nombreRaza')
      .populate('oferente', 'nombres apellidos')
      .sort({ fechaRegistro: -1 });

    res.json(mascotas);
  } catch (error) {
    next(error);
  }
};

export const obtenerMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const mascota = await MascotaModel.findById(id)
      .populate('tipoMascota', 'nombreTipo')
      .populate('raza', 'nombreRaza')
      .populate('oferente', 'nombres apellidos telefono');

    if (!mascota || !mascota.estado) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Mascota no encontrada',
        code: 'MASCOTA_NOT_FOUND',
        status: 404,
      });
    }

    res.json(mascota);
  } catch (error) {
    next(error);
  }
};
export const actualizarMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const datos = req.body;


    const mascota = await MascotaModel.findById(id);
    if (!mascota || !mascota.estado) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Mascota no encontrada',
        code: 'MASCOTA_NOT_FOUND',
        status: 404,
      });
    }

    // Verificar que el usuario es el oferente o admin
    const oferente = await OferenteModel.findOne({ usuario: userId });
    if (!oferente || mascota.oferente.toString() !== oferente._id.toString()) {
      if (req.user?.rol !== 'administrador') {
        throw new ApiError({
          name: 'FORBIDDEN',
          message: 'No tiene permisos para editar esta mascota',
          code: 'NOT_OWNER',
          status: 403,
        });
      }
    }

    if (datos.estadoAdopcion) {
      const estadosValidos = ['borrador', 'pendiente', 'publicado', 'disponible', 'adoptado', 'cancelado'];
      if (!estadosValidos.includes(datos.estadoAdopcion)) {
        throw new ApiError({
          name: 'BAD_REQUEST',
          message: `Estado de adopción no válido. Estados permitidos: ${estadosValidos.join(', ')}`,
          code: 'INVALID_ESTADO',
          status: 400,
        });
      }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } || {};
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    if (files.fotoPrincipal && files.fotoPrincipal[0]) {
      datos.fotoPrincipal = `${BASE_URL}/uploads/${files.fotoPrincipal[0].filename}`;
    }

    if (files.fotografias) {
      datos.fotografias = files.fotografias.map(file => `${BASE_URL}/uploads/${file.filename}`);
    }

    const mascotaActualizada = await MascotaModel.findByIdAndUpdate(
      id,
      { ...datos },
      { new: true, runValidators: true }
    );


    res.json(mascotaActualizada);
  } catch (error) {
    console.error('❌ [actualizarMascota] Error:', error);
    next(error);
  }
};
export const eliminarMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const mascota = await MascotaModel.findById(id);
    if (!mascota || !mascota.estado) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Mascota no encontrada',
        code: 'MASCOTA_NOT_FOUND',
        status: 404,
      });
    }

    // Verificar que el usuario es el oferente o admin
    const oferente = await OferenteModel.findOne({ usuario: userId });
    if (!oferente || mascota.oferente.toString() !== oferente._id.toString()) {
      if (req.user?.rol !== 'administrador') {
        throw new ApiError({
          name: 'FORBIDDEN',
          message: 'No tiene permisos para eliminar esta mascota',
          code: 'NOT_OWNER',
          status: 403,
        });
      }
    }

    await MascotaModel.findByIdAndUpdate(id, { estado: false, estadoAdopcion: 'cancelado' });
    res.json({ message: 'Mascota eliminada' });
  } catch (error) {
    next(error);
  }
};

export const misMascotas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    const oferente = await OferenteModel.findOne({ usuario: userId });
    if (!oferente) {
      throw new ApiError({
        name: 'NOT_FOUND',
        message: 'Perfil de oferente no encontrado',
        code: 'OFFERENT_NOT_FOUND',
        status: 404,
      });
    }

    const mascotas = await MascotaModel.find({ oferente: oferente._id, estado: true })
      .populate('tipoMascota', 'nombreTipo')
      .populate('raza', 'nombreRaza')
      .sort({ fechaRegistro: -1 });

    res.json(mascotas);
  } catch (error) {
    next(error);
  }
};