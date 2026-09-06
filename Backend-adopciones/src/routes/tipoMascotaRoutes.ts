import { Router } from 'express';
import {
  crearTipoMascota,
  listarTiposMascota,
  actualizarTipoMascota,
  eliminarTipoMascota,
} from '../controllers/tipoMascotaController';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/roles';

const router = Router();

router.get('/', listarTiposMascota);
router.post('/', authenticate, requireAdmin, crearTipoMascota);
router.put('/:id', authenticate, requireAdmin, actualizarTipoMascota);
router.delete('/:id', authenticate, requireAdmin, eliminarTipoMascota);

export default router;