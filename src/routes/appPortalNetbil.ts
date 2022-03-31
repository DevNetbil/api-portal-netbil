import { PrismaClient } from "@prisma/client";
import express from "express";
import Expo, { ExpoPushMessage } from "expo-server-sdk";

const erNotificacao = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
// Procurar

const NotificationService = async (
  idUsers: number[],
  message: ExpoPushMessage
) => {
  //-->
  // Tokens
  const userTokens = await prisma.net_app_pushtoken.findMany({
    where: { idUser: { in: idUsers } },
  });
  if (userTokens.length === 0) {
    return;
  }
  const expo = new Expo();
  userTokens.forEach((element) => {
    message.to = String(element.token);
    if (!Expo.isExpoPushToken(element.token)) {
      return;
    }
    let chunks = expo.chunkPushNotifications([message]);
    chunks.forEach(async (chunk) => {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        return;
      }
    });
  });
};

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

  const message: ExpoPushMessage = {
    to: 'token',
    body: '',
    data: { urlAction: `https://netbil.com.br/portal` }
  };

  
  await NotificationService(ids,message);

  res.json(["teste/AGENDAS"]);
});

erNotificacao.get(`/agendas/create`, async (req, res) => {
  console.log("criou um agenda notifca!");
  res.json(["teste/AGENDAS"]);
});

erNotificacao.get(`/`, async (req, res) => {
  console.log("teste");
  res.json(["teste/AGENDAS"]);
});

export default erNotificacao;
