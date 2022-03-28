import { PrismaClient } from "@prisma/client";
import express from "express";
import logged from "./functions/logged";
import erAgendas from "./routes/agenda";
import erError from "./routes/error";
import rtRegistro from "./routes/registro";

export const prisma = new PrismaClient();
export const app = express();

app.use(express.json());
app.use("/agendas", erAgendas);
app.use("/registro", rtRegistro);
app.use("/error", erError);

app.get(`/:what`, async (_req, res) => {
  const resultLogged = await logged(_req.headers);
  console.log("LOGADO ->", resultLogged);
  res.json([resultLogged]);
});

export default app;
