import { PrismaClient } from '@prisma/client';
import express from 'express';
import sendStatus from '../functions/sendStatus';

const erLogin = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
// Procurar
erLogin.post('/development', async (req, res) => {
  try {
    const { user, pass } = req.body.data;
    if (!user || !pass) {
      throw new Error('Usuário ou senha vazios.');
    }
    const result = await prisma.net_acessorestrito.findMany({
      select: {
        IDPerfil: true,
        ID: true,
        Sessao: true,
        Principal: true,
        Foto: true,
        Nome: true,
      },
      where: {
        Login: user,
        Senha: pass,
        Ativo: true,
      },
    });
    if (result.length === 0) {
      res.status(404).send({ message: 'Usuário não encontrado.' });
    }
    // ---------------------------------------------------------------->
    if (result[0].IDPerfil <= 2) {
      //
      let returned = {
        IDPerfil: result[0].IDPerfil,
        IDMasterPrincipal: result[0].ID,
        IDSchool: null,
        ID: result[0].ID,
        Sessao: result[0].Sessao,
        Turma: null,
        Foto: result[0].Foto,
        Nome: result[0].Nome,
      };
      if (!result[0].Principal) {
        const MasterPrincipal = await prisma.net_masterautorizado.findMany({
          select: { IDMasterPrincipal: true },
          where: { IDMaster: result[0].ID },
        });
        returned = {
          IDPerfil: result[0].IDPerfil,
          IDMasterPrincipal: MasterPrincipal[0].IDMasterPrincipal,
          IDSchool: null,
          ID: result[0].ID,
          Sessao: result[0].Sessao,
          Turma: null,
          Foto: result[0].Foto,
          Nome: result[0].Nome,
        };
      }
      res.json(returned);
    }
    // ---------------------------------------------------------------->
    if (result[0].IDPerfil === 3) {
      //
      const IDSchool = await prisma.net_escolaxusuario.findMany({
        select: {
          IDEscola: true,
        },
        where: { IDUsuario: result[0].ID },
      });
      const MasterSchool = await prisma.net_escolaxmaster.findMany({
        select: { IDMasterPrincipal: true },
        where: { IDEscola: IDSchool[0].IDEscola },
      });
      const returned = {
        IDPerfil: result[0].IDPerfil,
        IDMasterPrincipal: MasterSchool[0].IDMasterPrincipal,
        IDSchool: IDSchool[0].IDEscola,
        ID: result[0].ID,
        Sessao: result[0].Sessao,
        Turma: null,
        Foto: result[0].Foto,
        Nome: result[0].Nome,

      };
      res.json(returned);
    }
    // ---------------------------------------------------------------->
    if (result[0].IDPerfil === 4) {
      //
      const IDSchool = await prisma.net_escolaxusuario.findMany({
        select: {
          IDEscola: true,
        },
        where: { IDUsuario: result[0].ID },
      });
      const MasterSchool = await prisma.net_escolaxmaster.findMany({
        select: { IDMasterPrincipal: true },
        where: { IDEscola: IDSchool[0].IDEscola },
      });
      const returned = {
        IDPerfil: result[0].IDPerfil,
        IDMasterPrincipal: MasterSchool[0].IDMasterPrincipal,
        IDSchool: IDSchool[0].IDEscola,
        ID: result[0].ID,
        Sessao: result[0].Sessao,
        Turma: null,
        Foto: result[0].Foto,
        Nome: result[0].Nome,

      };
      res.json(returned);
    }
    // ---------------------------------------------------------------->
    if (result[0].IDPerfil === 5) {
      //
      const MasterResponsavel = await prisma.net_responsavelxmaster.findMany({
        select: { IDMasterPrincipal: true },
        where: { IDResponsavel: result[0].ID },
      });
      const IDSchool = await prisma.net_escolaxmaster.findMany({
        select: {
          IDEscola: true,
        },
        where: { IDMasterPrincipal: MasterResponsavel[0].IDMasterPrincipal },
      });
      const returned = {
        IDPerfil: result[0].IDPerfil,
        IDMasterPrincipal: MasterResponsavel[0].IDMasterPrincipal,
        IDSchool: IDSchool[0].IDEscola,
        ID: result[0].ID,
        Sessao: result[0].Sessao,
        Turma: null,
        Foto: result[0].Foto,
        Nome: result[0].Nome,

      };
      res.json(returned);
    }
    // ---------------------------------------------------------------->
    if (result[0].IDPerfil === 6) {
      const IDSchool = await prisma.net_escolaxusuario.findMany({
        select: {
          IDEscola: true,
        },
        where: { IDUsuario: result[0].ID },
      });
      const MasterSchool = await prisma.net_escolaxmaster.findMany({
        select: { IDMasterPrincipal: true },
        where: { IDEscola: IDSchool[0].IDEscola },
      });
      const TurmaAluno = await prisma.net_alunoxturma.findMany({
        select: {
          IDTurma: true,
        },
        where: { IDAluno: result[0].ID },
      });
      const returned = {
        IDPerfil: result[0].IDPerfil,
        IDMasterPrincipal: MasterSchool[0].IDMasterPrincipal,
        IDSchool: IDSchool[0].IDEscola,
        ID: result[0].ID,
        Sessao: result[0].Sessao,
        Turma: TurmaAluno[0].IDTurma,
        Foto: result[0].Foto,
        Nome: result[0].Nome,

      };
      res.json(returned);
    }
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});

erLogin.get('/usuario', async (req, res) => {
  res.json(['teste/usuario']);
});

erLogin.get('/usuario/teste', async (req, res) => {
  res.json(['teste/usuario/teste']);
});

export default erLogin;
