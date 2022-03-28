import { PrismaClient } from "@prisma/client";
import express from "express";

const erAgendas = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
// Procurar
erAgendas.get(`/`, async (req, res) => {
  res.json(["teste/AGENDAS"]);
});

erAgendas.get(`/usuario`, async (req, res) => {
  res.json(["teste/usuario"]);
});

erAgendas.get(`/usuario/teste`, async (req, res) => {
  res.json(["teste/usuario/teste"]);
});

export default erAgendas;
