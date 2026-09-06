import { Router } from 'express';
import {
  crearMascota,
  listarMascotas,
  obtenerMascota,
  actualizarMascota,
  eliminarMascota,
  misMascotas,
} from '../controllers/mascotaController';
import { authenticate } from '../middlewares/auth';
import { requireOferente, requireAdmin } from '../middlewares/roles';
import { validate, validacionesMascota } from '../middlewares/validation';
import { uploadMascota } from '../middlewares/upload'; 

const router = Router();

router.get('/', listarMascotas);
router.get('/mis-mascotas', authenticate, requireOferente, misMascotas);
router.get('/:id', obtenerMascota);

router.post(
  '/',
  authenticate,
  requireOferente,
  uploadMascota,
  validate(validacionesMascota),
  crearMascota
);

router.put('/:id', authenticate, actualizarMascota);
router.delete('/:id', authenticate, eliminarMascota);

export default router;