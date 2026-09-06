import express from "express";
import cors from "cors";
import path from 'path';
import { errorHandler } from "./middlewares/errorHandler";

import authRoutes from "./routes/authRoutes";
import tipoMascotaRoutes from "./routes/tipoMascotaRoutes";
import razaRoutes from "./routes/razaRoutes";
import mascotaRoutes from "./routes/mascotaRoutes";
import solicitudRoutes from "./routes/solicitudRoutes";
import adopcionRoutes from "./routes/adopcionRoutes";
import seguimientoRoutes from "./routes/seguimientoRoutes";
import notificacionRoutes from "./routes/notificacionRoutes";
import reporteRoutes from "./routes/reporteRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/tipos-mascota", tipoMascotaRoutes);
app.use("/api/razas", razaRoutes);
app.use("/api/mascotas", mascotaRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/adopciones", adopcionRoutes);
app.use("/api/seguimientos", seguimientoRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/admin", adminRoutes); 

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🐾 API de Gestión de Adopciones de Mascotas - Sucre");
});

// Middleware de errores (debe ir al final)
app.use(errorHandler);

export default app;