import { PrismaClient } from "@prisma/client";
import express from "express";

const erError = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
erError.get(`/`, async (req, res) => {
  res.json(["error"]);
});

export default erError;
