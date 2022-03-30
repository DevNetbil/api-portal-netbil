import {
  net_acessorestrito,
  net_registropedagogico,
  PrismaClient,
} from "@prisma/client";
import express from "express";

import logged from "../functions/logged";
import moment from "moment-timezone";

const rtRegistro = express.Router();
const prisma = new PrismaClient();

const dtaManipulator = `${moment()
  .subtract(1, "year")
  .tz("America/Sao_Paulo")
  .format("YYYY")}-12-31`;
// er - ExpressRouter.
//

const getEscolasMaster = async (IDMaster: number) => {
  try {
    const EscolasMaster = await prisma.net_escola.findMany({
      select: { ID: true },
      where: { IDMaster: IDMaster },
    });
  } catch (error) {}
};

// Procurar todos registros
rtRegistro.get(`/`, async (req, res) => {
  try {
    let userInfo: net_acessorestrito = (await logged(req.headers))[0];
    let results: any[] = [];
    switch (userInfo.IDPerfil) {
      case 1:
        // Mando todos os registros.
        results = await prisma.net_registropedagogico.findMany();
        break;
      case 2:
        // Mando todos os registros criados pelos professores que são daquele master.
        const EscolasMaster = await prisma.net_escola.findMany({
          select: { ID: true },
          where: { IDMaster: userInfo.ID },
        });
        const UsersEscola = await prisma.net_escolaxusuario.findMany({
          select: { IDUsuario: true },
          where: {
            IDEscola: { in: EscolasMaster.map((e) => e.ID) },
          },
        });
        const ProfessoresEscola = await prisma.net_acessorestrito.findMany({
          select: { IDPerfil: true, Nome: true, ID: true },
          where: {
            ID: { in: UsersEscola.map((e) => e.IDUsuario) },
            IDPerfil: {
              equals: 4,
            },
          },
        });
        results = await prisma.net_registropedagogico.findMany({
          where: {
            IDProfessor: { in: ProfessoresEscola.map((e) => e.ID) },
            DataCadastro: {
              gte: new Date(dtaManipulator),
            },
          },
        });
        break;
      case 4:
        // Mando todos os registros.
        results = await prisma.net_registropedagogico.findMany({ take: 100 });
        break;
      // results = await prisma.net_agenda_escolar.findMany({
      //   where: {
      //     DataCriacao: {
      //       not: null,
      //     },
      //   },
      // });
      // const escolas = await getEscolasMaster(userInfo.ID);
      // console.log({ escolas });
      // console.log("IDS", escolas.map((e) => e.ID).join());
      // results = await prisma.net_registropedagogico.findMany({
      //   where: {
      //     IDProfessor: { in: escolas.map((e) => e.ID) },
      //   },
      // });

      default:
        break;
    }
    if (results.length > 0) {
      return res.json([results.length, results]);
    }
    throw new Error("Nenhum registro encontrado");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error");
      res.status(500).send({ error: error.message });
    }
  }
});

rtRegistro.get(`/usuario`, async (req, res) => {
  res.json(["teste/usuario"]);
});

rtRegistro.get(`/usuario/teste`, async (req, res) => {
  res.json(["teste/usuario/teste"]);
});

export default rtRegistro;
