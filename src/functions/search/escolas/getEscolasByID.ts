import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

const getEscolasByID = async (ID:number) => {
  try {
    const escola = await prisma.net_escola.findUnique({
      where: { ID },
    });
    return escola;
  } catch (error) {
    throw new Error();
  }
};

export default getEscolasByID;
