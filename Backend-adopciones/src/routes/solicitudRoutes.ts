import { Router } from 'express';
import {
  crearSolicitud,
  listarSolicitudes,
  solicitudesRecibidas,
  responderSolicitud,
  obtenerSolicitud,
  cancelarSolicitud,
} from '../controllers/solicitudController';
import { authenticate } from '../middlewares/auth';
import { requireSolicitante, requireOferente } from '../middlewares/roles';
import { validate, validacionesSolicitud } from '../middlewares/validation';

const router = Router();


router.get('/test', (req, res) => {
  res.json({ 
    message: '✅Ruta de solicitudes funcionando',
    timestamp: new Date().toISOString()
  });
});

router.get('/mis-solicitudes', authenticate, requireSolicitante, listarSolicitudes);
router.get('/recibidas', authenticate, requireOferente, solicitudesRecibidas);

router.post('/', authenticate, requireSolicitante, validate(validacionesSolicitud), crearSolicitud);

//  Rutas con parámetros (deben ir al final)
router.get('/:id', authenticate, obtenerSolicitud);
router.put('/:id/responder', authenticate, requireOferente, responderSolicitud);
router.put('/:id/cancelar', authenticate, requireSolicitante, cancelarSolicitud);

export default router;