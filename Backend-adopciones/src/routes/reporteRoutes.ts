import { Router } from 'express';
import {
  estadisticasGenerales,
  reporteAdopciones,
  reporteMascotas,
  reporteSolicitudes,
} from '../controllers/reporteController';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/roles';

const router = Router();

router.get('/estadisticas', authenticate, requireAdmin, estadisticasGenerales);
router.get('/adopciones', authenticate, requireAdmin, reporteAdopciones);
router.get('/mascotas', authenticate, requireAdmin, reporteMascotas);
router.get('/solicitudes', authenticate, requireAdmin, reporteSolicitudes);

export default router;