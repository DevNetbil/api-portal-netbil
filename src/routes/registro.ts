import { PrismaClient } from "@prisma/client";
import express from "express";

const rtRegistro = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
//
// Procurar todos
rtRegistro.get(`/`, async (req, res) => {
  try {
    const results = prisma.net_registropedagogico.findMany();
    res.json(results);
  } catch (error) {
    res.status(500).end();
  }
});

rtRegistro.get(`/usuario`, async (req, res) => {
  res.json(["teste/usuario"]);
});

rtRegistro.get(`/usuario/teste`, async (req, res) => {
  res.json(["teste/usuario/teste"]);
});

export default rtRegistro;
