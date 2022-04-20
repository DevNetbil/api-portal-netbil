import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

const getEscolasByDiretor = async (IDMaster:number) => {
  try {
    const escolaxusuario = await prisma.net_escolaxusuario.findMany({
      where: { IDUsuario: IDMaster },
    });
    const escola = await prisma.net_escola.findMany({
      where: { ID: escolaxusuario[0].IDEscola, Ativo: true },
    });
    return escola;
  } catch (error) {
    throw new Error();
  }
};

export default getEscolasByDiretor;
