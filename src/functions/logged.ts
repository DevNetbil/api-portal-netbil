import { PrismaClient } from '@prisma/client';
import { IncomingHttpHeaders } from 'http';

type getHeadersProps = {
  'Content-Type': 'application/json';
  idprofile: string;
  idmaster: string;
  idschool: string;
  iduser: string;
  section: string;
};

export const prisma = new PrismaClient();

const logged = async (headers: IncomingHttpHeaders) => {
  const {
    idprofile, idmaster, idschool, iduser, idUser,
  } = headers;
  try {
    const result = await prisma.net_acessorestrito.findMany({
      where: {
        ID: Number(iduser) || Number(idUser),
      },
    });

    if (result.length > 0) {
      return result[0];
    }
    throw new Error('Usuário não logado');
  } catch (error) {
    throw new Error('Usuário não logado');
  }
};

export default logged;
