import express from "express";
import { indexRouter } from "./routes/index";

export const app = express();

app.use(express.json());
app.use("/", indexRouter);
