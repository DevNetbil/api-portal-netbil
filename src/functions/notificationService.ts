import { net_app_pushtoken, PrismaClient } from "@prisma/client";
import Expo, { ExpoPushMessage } from "expo-server-sdk";

const prisma = new PrismaClient();

const messageGenerator = async (type:string, creatorID:number)  =>{
    let messageExport = "";    
    const infoCreator = await prisma.net_acessorestrito.findMany({where:{
        ID: creatorID
    }});
    switch (type) {
        case 'agendas':
        //Generate Message -->
        messageExport = `${infoCreator[0].Nome.split(' ').shift()} criou uma nova agenda mencionando você!`;
        break;
        case 'aulas':
        //Generate Message -->
        messageExport = `${infoCreator[0].Nome.split(' ').shift()} criou uma nova aula mencionando você!`;
        break;
        case 'registro':
        //Generate Message -->
        messageExport = `${infoCreator[0].Nome.split(' ').shift()} criou um novo registro mencionando você!`;
        break;   
        default:
        messageExport = "";
        break;
    }
    return messageExport;
}

export const notificationService = async (
    idUsers: number[]
  ) => {    
    // Tokens
    const userTokens = await prisma.net_app_pushtoken.findMany({
      where: { idUser: { in: idUsers } },
    });
    if (userTokens.length === 0) {
      return;
    }
    const expo = new Expo();
    userTokens.forEach((element: net_app_pushtoken) => {

         
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