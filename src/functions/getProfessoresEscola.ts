import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const getProfessoresEscola = async (idEscola: number) => {
  try {
    const result2 = await prisma.net_escolaxusuario.findMany({});
    const result = await prisma.net_escola.findMany({
      where: {},
      include: {
        net_escolaxensino: true,
        net_escolaxusuario: true,
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
