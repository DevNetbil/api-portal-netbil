import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

const getEscolasByNetbil = async () => {
  try {
    const escolas = await prisma.net_escola.findMany({ where: { Ativo: true } });
    return escolas;
  } catch (error) {
    throw new Error();
  }
};

export default getEscolasByNetbil;
