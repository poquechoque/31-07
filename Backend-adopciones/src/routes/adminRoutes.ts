import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/roles';
import {
  listarUsuarios,
  cambiarEstadoUsuario,
  listarTodasMascotas,
  listarTodasSolicitudes,
} from '../controllers/adminController';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/usuarios', listarUsuarios);
router.put('/usuarios/:id/estado', cambiarEstadoUsuario);

router.get('/mascotas', listarTodasMascotas);

router.get('/solicitudes', listarTodasSolicitudes);

export default router;