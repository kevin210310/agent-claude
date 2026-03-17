import { Router, Request, Response } from "express";

export const indexRouter = Router();

indexRouter.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});
