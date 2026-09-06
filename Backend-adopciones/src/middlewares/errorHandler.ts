import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/ApiError";


export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {



  if (req.originalUrl.includes("/auth/signin")) {
    return res.status(401).json({
      message: "Credenciales incorrectas",
    });
  }



  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      code: err.code,
      name: err.name,
    });
  }


  console.error(err);



  return res.status(500).json({
    message: "Error interno del servidor",
  });
};
