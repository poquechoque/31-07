import { Router } from 'express';
import {
  registrarAdopcion,
  listarAdopciones,
  obtenerAdopcion,
  actualizarEstadoAdopcion,
  misAdopciones,
} from '../controllers/adopcionController';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/roles';

const router = Router();

router.get('/', authenticate, requireAdmin, listarAdopciones);
router.get('/mis-adopciones', authenticate, misAdopciones);
router.get('/:id', authenticate, obtenerAdopcion);
router.post('/', authenticate, requireAdmin, registrarAdopcion);
router.put('/:id/estado', authenticate, requireAdmin, actualizarEstadoAdopcion);

export default router;