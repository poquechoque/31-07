import { Router } from 'express';
import {
  listarNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
} from '../controllers/notificacionController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, listarNotificaciones);
router.put('/:id/leer', authenticate, marcarComoLeida);
router.put('/leer-todas', authenticate, marcarTodasComoLeidas);
router.delete('/:id', authenticate, eliminarNotificacion);

export default router;