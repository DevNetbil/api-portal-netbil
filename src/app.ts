import { PrismaClient } from "@prisma/client";
import express from "express";

export const prisma = new PrismaClient();
export const app = express();

app.use(express.json());

app.get(`/user`, async (_req, res) => {
  //   const result = await prisma.user.findMany();
  console.log("ex");
  res.json(["ex"]);
});

app.post(`/user`, async (req, res) => {
  console.log("ex");
  res.json(["ex"]);
  //   const { name, email } = req.body;
  //   try {
  //     const result = await prisma.user.create({
  //       data: {
  //         name,
  //         email,
  //       },
  //     });
  //     res.json(result);
  //   } catch (e) {
  //     res.status(409).json({
  //       error: "User already exists!",
  //     });
  //   }
});
