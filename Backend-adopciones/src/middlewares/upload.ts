import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurar que la carpeta uploads existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `mascota-${uniqueSuffix}${ext}`);
  }
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, JPG, WEBP, GIF)'), false);
  }
};

// Configurar multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Middleware para subir múltiples imágenes (hasta 5)
export const uploadMascota = upload.fields([
  { name: 'fotoPrincipal', maxCount: 1 },
  { name: 'fotografias', maxCount: 5 }
]);

// Middleware para subir una sola imagen
export const uploadSingle = upload.single('fotoPrincipal');