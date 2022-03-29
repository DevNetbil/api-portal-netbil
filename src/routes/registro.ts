import { PrismaClient } from "@prisma/client";
import express from "express";
import logged from "../functions/logged";

const rtRegistro = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
//
// Procurar todos registros
rtRegistro.get(`/`, async (req, res) => {
  try {
    if (!!logged(req.headers)) {
      throw new Error("Usuário não logado");
    }
    const results = prisma.net_registropedagogico.findMany();
    res.json(results);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    }
  }
});

rtRegistro.get(`/usuario`, async (req, res) => {
  res.json(["teste/usuario"]);
});

rtRegistro.get(`/usuario/teste`, async (req, res) => {
  res.json(["teste/usuario/teste"]);
});

export default rtRegistro;
