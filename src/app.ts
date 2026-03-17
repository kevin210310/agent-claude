import express from "express";
import { indexRouter } from "./routes/index.js";

/**
 * Instancia principal de la aplicación Express.
 *
 * Configura el middleware JSON y monta las rutas base.
 * Exportada para permitir su uso en tests sin iniciar el servidor.
 */
export const app = express();

app.use(express.json());
app.use("/", indexRouter);
