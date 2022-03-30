import { PrismaClient } from "@prisma/client";
import { IncomingHttpHeaders } from "http";

type Props = {
  "Content-Type": "application/json";
  profileid: string;
  masterid: string;
  schoolid: string;
  userid: string;
  section: string;
};

export const prisma = new PrismaClient();

const logged = async (headers: Props | IncomingHttpHeaders) => {
  const { profileid, userid } = headers;
  try {
    const result = await prisma.net_acessorestrito.findMany({
      where: {
        ID: Number(userid),
        // IDPerfil: Number(profileid),
      },
    });
    if (result.length > 0) {
      return result;
    }
    throw new Error("Usuário não logado");
  } catch (error) {
    throw new Error("Usuário não logado");
  }
};

export default logged;
