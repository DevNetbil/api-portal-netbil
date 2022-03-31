import { PrismaClient } from "@prisma/client";
import express from "express";
import logged from "./functions/logged";
import erAgendas from "./routes/agenda";
import erError from "./routes/error";
import rtRegistro from "./routes/registro";
import moment from "moment-timezone";

export const prisma = new PrismaClient();
export const app = express();

app.use(express.json());

app.get(`/:what`, async (_req, res) => {
  const data = moment().locale("pt-br").tz("America/Sao_Paulo").format("L");
  const time = moment().locale("pt-br").tz("America/Sao_Paulo").format("LT");
  //   const resultLogged = await logged(_req.headers);
  //   console.log("LOGADO ->", resultLogged);
  //   const resultado = await prisma.
  const resultado = await prisma.net_escola.findMany({});
  console.log("headers", _req.headers);
  res.json([data, time, resultado]);
});

// app.get(`/:what/:second`, async (_req, res) => {
//   res.redirect(200, `/${_req.params.what}/${_req.params.second}`);
//   const data = moment().locale("pt-br").tz("America/Sao_Paulo").format("L");
//   const time = moment().locale("pt-br").tz("America/Sao_Paulo").format("LT");
//   const resultLogged = await logged(_req.headers);
//   console.log("LOGADO ->", resultLogged);
//   res.json([data, time, "second"]);
// });

// app.use("/agendas", erAgendas);
// app.use("/registro", rtRegistro);
// app.use("/error", erError);

export default app;
