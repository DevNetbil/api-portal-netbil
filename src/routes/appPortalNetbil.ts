import { PrismaClient } from "@prisma/client";
import express from "express";
import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { notificationService } from "../functions/notificationService";

const erNotificacao = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
// Procurar



// ------------------------------------------------------->

erNotificacao.get(`/aulas`, async (req, res) => {

  const { ownerID, professores, alunos, gestores } = req.body;
  const ids:number[] = [];  

  professores.forEach((element: any) => {
    ids.push(Number(element));
  });
  alunos.forEach((element: any) => {
    ids.push(Number(element));
  });
  gestores.forEach((element: any) => {
    ids.push(Number(element));
  });

 

  
  await notificationService(ids,message);

  res.json(["teste/AGENDAS"]);
});

erNotificacao.get(`/agendas/create`, async (req, res) => {
 
  res.json(["teste/AGENDAS"]);
});

erNotificacao.get(`/`, async (req, res) => {
  console.log("teste");
  res.json(["teste/AGENDAS"]);
});

export default erNotificacao;
