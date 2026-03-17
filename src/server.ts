import { app } from "./app.js";

const PORT = Number(process.env.PORT ?? 3000);
if (Number.isNaN(PORT)) throw new Error(`PORT inválido: ${process.env.PORT}`);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
