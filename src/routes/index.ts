import { Router } from "express";
import type { Request, Response } from "express";
/**
 * Router raíz de la aplicación.
 *
 * Agrupa los endpoints montados en `/`.
 */
export const indexRouter = Router();

/**
 * GET /
 *
 * Endpoint de verificación de salud. Devuelve un mensaje de bienvenida.
 *
 * @returns `{ message: "Hello World" }` con status 200.
 */
indexRouter.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});
