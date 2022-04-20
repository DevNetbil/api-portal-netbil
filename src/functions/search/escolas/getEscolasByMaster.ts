import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

const getEscolasByMaster = async (IDMaster:number) => {
  try {
    const escolaxmaster = await prisma.net_escolaxmaster.findMany({
      where: { IDMasterPrincipal: IDMaster },
    });
    const escolas = prisma.net_escola.findMany({
      where: { ID: { in: escolaxmaster.map((element) => element.IDEscola) }, Ativo: true },
    });
    return escolas;
  } catch (error) {
    throw new Error();
  }
};

export default getEscolasByMaster;
