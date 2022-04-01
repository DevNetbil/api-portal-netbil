import {
  net_agenda_escolar, net_app_pushtoken, net_comunicados, net_registropedagogico, PrismaClient,
} from '@prisma/client';
import express from 'express';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import moment from 'moment';

const erNotificacao = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
// Procurar
// ------------------------------------------------------->
const NotificationService = async (
  IDUsers: number[],
  IDCreator: number,
  ItemCore: net_agenda_escolar|net_comunicados|net_registropedagogico,
  FinalURL: string,
  type: 'Agenda'|'Aula'|'Registro'|'Agenda-Chat'|'Aula-Chat',
  textMessage?: string,
) => {
  try {
    // Buscar informações do creator d/ Agenda, Aula ou Registro
    const infoCreator = await prisma.net_acessorestrito.findMany({
      where: {
        ID: IDCreator,
      },
    });
    // >>>
    // Buscar tokens
    const usersTokens = await prisma.net_app_pushtoken.findMany({
      where: { idUser: { in: IDUsers } },
    });
    // >>>
    const one = type === 'Agenda' || type === 'Aula' ? 'uma nova' : 'um novo';
    let text = `${infoCreator[0].Nome.split(' ').shift()} criou ${one} ${type.toLocaleLowerCase()} mensionando você!`;
    // >>>
    if (type === 'Agenda-Chat' || type === 'Aula-Chat') {
      text = String(textMessage);
    }
    // >>>
    const expo = new Expo();
    usersTokens.forEach((element: net_app_pushtoken) => {
      if (!Expo.isExpoPushToken(element.token)) {
        return;
      }
      // >>>
      // Corpo da mensagem que vai ser enviada.
      let message: ExpoPushMessage = {
        to: element.token,
        body: text,
        data: { urlAction: FinalURL, idNotification: ItemCore.ID },
      };
      // Corpo da mensagem se for para os chats.
      if (type === 'Agenda-Chat' || type === 'Aula-Chat') {
        message = {
          to: element.token,
          title: infoCreator[0].Nome.split(' ').shift(),
          body: text,
          data: { urlAction: FinalURL, idNotification: ItemCore.ID },
        };
      }
      // >>>
      if (type === 'Aula') {
        const DataInicial = (ItemCore as net_comunicados).DataInicio ? moment((ItemCore as net_comunicados).DataInicio).locale('pt-br').format('LL') : null;
        const DataFinal = (ItemCore as net_comunicados).DataFim ? moment((ItemCore as net_comunicados).DataFim).locale('pt-br').format('LL') : null;
        if (DataInicial && DataFinal) {
          const { HoraI } = ItemCore as net_comunicados;
          const { HoraF } = ItemCore as net_comunicados;
          let bodyText = `Começando dia ${DataInicial} com término dia ${DataFinal}.`;
          if (HoraI && HoraI) {
            bodyText = `Começando dia ${DataInicial} às ${HoraI} com término dia ${DataFinal} às ${HoraF}.`;
          }
          message = {
            to: element.token,
            title: text,
            body: bodyText,
            data: { urlAction: FinalURL, idNotification: ItemCore.ID },
          };
        }
      }
      const chunks = expo.chunkPushNotifications([message]);
      chunks.forEach(async (chunk) => {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          throw new Error('');
        }
      });
    });
  } catch (error) {
    throw new Error('');
  }
};

// ------------------------------------------------------->

erNotificacao.post('/aula/create', async (req, res) => {
  try {
    const {
      ownerID, professores, alunos, gestores,
    } = req.body;
    const ids:number[] = [];
    if (professores) {
      professores.forEach((element: any) => {
        ids.push(Number(element));
      });
    }
    if (alunos) {
      alunos.forEach((element: any) => {
        ids.push(Number(element));
      });
    }
    if (gestores) {
      gestores.forEach((element: any) => {
        ids.push(Number(element));
      });
    }
    // Pegar ultima aula que foi criada.
    const lastDataAula = await prisma.net_comunicados.findFirst({
      where: {
        IDUsuario: ownerID,
      },
      orderBy: {
        ID: 'desc',
      },
    });
    if (lastDataAula) {
      const urlFinal = `https://netbil.com.br/portal/${lastDataAula.ID}`;
      await NotificationService(ids, ownerID, lastDataAula, urlFinal, 'Aula');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    }
  }
});

erNotificacao.post('/registro/create', async (req, res) => {
  try {
    const {
      ownerID, professor, aluno,
    } = req.body;
    const ids:number[] = [];
    if (professor !== '') {
      ids.push(Number(professor));
    }
    if (aluno !== '') {
      ids.push(Number(aluno));
    }
    // Pegar ultimo registro que foi criado.
    const lastDataRegistro = await prisma.net_registropedagogico.findFirst({
      where: {
        IDUsuario: ownerID,
      },
      orderBy: {
        ID: 'desc',
      },
    });
    // >>>
    if (lastDataRegistro) {
      const urlFinal = `https://netbil.com.br/portal/${lastDataRegistro.ID}`;
      await NotificationService(ids, ownerID, lastDataRegistro, urlFinal, 'Registro');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    }
  }
});

erNotificacao.post('/agenda/chat', async (req, res) => {
  try {
    const {
      ownerID, destinatarios, idAgenda, messageText,
    } = req.body;

    const ids: number[] = [];
    if (destinatarios) {
      destinatarios.forEach((element: any) => {
        if (Number(element.ID) === ownerID) {
          return;
        }
        ids.push(Number(element.ID) || Number(element.IDResponsavel));
      });
    }
    const agendaCore = await prisma.net_agenda_escolar.findUnique({
      where: {
        ID: idAgenda,
      },
    });
    if (agendaCore) {
      const urlFinal = `https://netbil.com.br/portal/v3/${agendaCore.ID}`;
      await NotificationService(ids, ownerID, agendaCore, urlFinal, 'Agenda-Chat', messageText);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    }
  }
});

export default erNotificacao;
