import { Router } from 'express';
import {
  crearRaza,
  listarRazas,
  actualizarRaza,
  eliminarRaza,
} from '../controllers/razaController';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/roles';

const router = Router();

router.get('/', listarRazas);
router.post('/', authenticate, requireAdmin, crearRaza);
router.put('/:id', authenticate, requireAdmin, actualizarRaza);
router.delete('/:id', authenticate, requireAdmin, eliminarRaza);

export default router;