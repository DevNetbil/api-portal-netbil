import { PrismaClient } from "@prisma/client";
import { IncomingHttpHeaders } from "http";

type Props = {
  "Content-Type": "application/json";
  profileID: string;
  masterID: string;
  schoolID: string;
  userId: string;
  section: string;
};

export const prisma = new PrismaClient();

const logged = async (headers: Props | IncomingHttpHeaders) => {
  try {
    const result = await prisma.net_acessorestrito.findMany({
      where: {
        ID: Number(headers.userId),
        IDPerfil: Number(headers.profileID),
      },
    });
    if (result || result !== "") {
      return result;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export default logged;
