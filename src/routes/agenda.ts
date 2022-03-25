import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const erAgendas = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
erAgendas.post(`/`, async (req, res) => {
  console.log({ req });
  console.log({ res });
  res.json(req);
});

export default erAgendas;
