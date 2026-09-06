import { Router } from 'express';
import {
  crearSeguimiento,
  listarSeguimientos,
  obtenerSeguimiento,
} from '../controllers/seguimientoController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, listarSeguimientos);
router.get('/:id', authenticate, obtenerSeguimiento);
router.post('/', authenticate, crearSeguimiento);

export default router;