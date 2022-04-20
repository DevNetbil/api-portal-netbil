import { PrismaClient } from '@prisma/client';
import express from 'express';
import logged from '../functions/logged';
import sendStatus from '../functions/sendStatus';

const rtFilter = express.Router();
const prisma = new PrismaClient();

// ---------------------------------------------------------------->
rtFilter.get('/alunos/turma/:IDTurma', async (req, res) => {
  try {
    await logged(req.headers);
    if (!req.params.IDTurma) {
      sendStatus(res, 'bad_request', 'IDTurma inválido.');
      return;
    }
    const alunoxturma = await prisma.net_alunoxturma.findMany({
      where: {
        IDTurma: Number(req.params.IDTurma),
      },
    });
    const result = await prisma.net_acessorestrito.findMany({
      select: {
        ID: true,
        Nome: true,
      },
      where: { ID: { in: alunoxturma.map((e) => e.IDAluno) } },
      orderBy: { Nome: 'asc' },
    });
    res.json(result);
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
// Buscar professores conforme o IDTurma ->
rtFilter.get('/professores/turma/:IDTurma', async (req, res) => {
  try {
    await logged(req.headers);
    if (!req.params.IDTurma) {
      sendStatus(res, 'bad_request', 'IDTurma inválido.');
      return;
    }

    const formulacalculo = await prisma.net_formulacalculo.findMany({
      where: {
        IDTurma: Number(req.params.IDTurma),
        Ativo: true,
      },
    });

    const materiasusuario = await prisma.net_materiasxusuario.findMany({
      where: {
        ID: { in: formulacalculo.map((e) => Number(e.IDMateriaProfessor)) },
      },
    });

    const professores = await prisma.net_acessorestrito.findMany({
      select: { ID: true, Nome: true },
      where: {
        ID: { in: materiasusuario.map((e) => e.IDUsuario) },
      },
      orderBy: { Nome: 'asc' },
    });
    res.json(professores);
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
// Buscar turmas conforme o IDProfessor ->
rtFilter.get('/turmas/professor/:IDProfessor/:IDEscola', async (req, res) => {
  try {
    await logged(req.headers);
    const { IDProfessor, IDEscola } = req.params;
    if (!IDProfessor || !IDEscola) {
      sendStatus(res, 'bad_request', 'Dados incompletos.');
      return;
    }
    const materiasxusuario = await prisma.net_materiasxusuario.findMany({
      where: {
        IDUsuario: Number(IDProfessor),
      },
    });

    const formulacalculo = await prisma.net_formulacalculo.findMany({
      where: {
        IDMateriaProfessor: { in: materiasxusuario.map((e) => e.ID) },
      },
    });
    const turmas = await prisma.net_turmas.findMany({
      select: {
        ID: true,
        net_tipoensino: true,
        net_series: true,
        net_tiposturma: true,
        net_turnos: true,
      },
      where: {
        ID: { in: formulacalculo.map((e) => e.IDTurma) },
      },
    });

    const result: any[] = [];
    turmas.forEach((element) => {
      const obj = {
        ID: element.ID,
        Nome: `${element.net_tipoensino.Tipo}-${element.net_series.Serie}-${element.net_tiposturma.Tipo}-${element.net_turnos.Turno}`,
      };
      result.push(obj);
    });
    res.json(result);
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
// Buscar turmas conforme o IDEscola ->
rtFilter.get('/turmas/escola/:IDEscola', async (req, res) => {
  try {
    await logged(req.headers);
    if (!req.params.IDEscola) {
      sendStatus(res, 'bad_request', 'IDEscola inválido.');
      return;
    }
    const turmas = await prisma.net_turmas.findMany({
      select: {
        ID: true,
        IDProf_Resp: true,
        net_series: { select: { Serie: true } },
        net_tipoensino: { select: { Tipo: true } },
        net_turnos: {
          select: { Turno: true },
        },
        net_tiposturma: { select: { Tipo: true } },
      },
      where: {
        IDEscola: Number(req.params.IDEscola),
        net_series: {
          Ativo: true,
        },
        net_tipoensino: {
          Ativo: true,
        },
        net_turnos: {
          Ativo: true,
        },
      },
    });
    const result: any[] = [];
    turmas.forEach((element) => {
      const obj = {
        ID: element.ID,
        Nome: `${element.net_tipoensino.Tipo}-${element.net_series.Serie}-${element.net_tiposturma.Tipo}-${element.net_turnos.Turno}`,
      };
      result.push(obj);
    });

    res.json(result);
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
// Buscar escolas conforme o IDMaster ->
rtFilter.get('/escolas/master/:IDMaster', async (req, res) => {
  try {
    await logged(req.headers);
    if (!req.params.IDMaster) {
      sendStatus(res, 'bad_request', 'IDMaster inválido.');
      return;
    }
    const result = await prisma.net_escola.findMany({
      select: {
        ID: true,
        Nome: true,
      },
      where: {
        IDMaster: Number(req.params.IDMaster),
      },
      orderBy: { Nome: 'asc' },
    });
    res.json(result);
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
// Buscar todos os masters ativos ->
rtFilter.get('/masters', async (req, res) => {
  try {
    const infoUser = await logged(req.headers);
    if (infoUser.IDPerfil !== 1) {
      sendStatus(res, 'unauthorized', 'Perfil não autorizado.');
      return;
    }
    const result = await prisma.net_acessorestrito.findMany({
      select: {
        ID: true,
        Nome: true,
        net_escolaxmaster: false,
      },
      where: {
        net_escolaxmaster: {
          some: {},
        },
        IDPerfil: 2,
        Ativo: true,
      },
      orderBy: { Nome: 'asc' },

    });
    res.json(result);
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});

export default rtFilter;
