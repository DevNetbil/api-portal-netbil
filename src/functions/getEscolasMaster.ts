import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const getEscolasMaster = async (idMaster: number) => {
  try {
    const result = await prisma.net_escola.findMany({
      where: {
        IDMaster: Number(idMaster),
      },
    });
    if (result.length > 0) {
      return result;
    }
    throw new Error("Master não possui escolas");
  } catch (error) {
    throw new Error("Master não possui escolas");
  }
};
