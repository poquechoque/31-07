import { Router } from 'express';
import { registro, login, perfil, cambiarContrasena } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { validate, validacionesRegistro, validacionesLogin } from '../middlewares/validation';

const router = Router();

router.post('/registro', validate(validacionesRegistro), registro);
router.post('/login', validate(validacionesLogin), login);
router.get('/perfil', authenticate, perfil);
router.put('/cambiar-contrasena', authenticate, cambiarContrasena);

export default router;