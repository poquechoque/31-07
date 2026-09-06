import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/database/connection";
import { env } from "./config/env";


const startServer = async () => {
  await connectDB();


  const PORT = env.port;


  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();