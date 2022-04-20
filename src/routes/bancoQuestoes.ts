import {
  PrismaClient,
} from '@prisma/client';
import express from 'express';
import logged from '../functions/logged';
import getQuestoes from '../functions/search/questoes/getQuestoes';
import sendStatus from '../functions/sendStatus';

const erBDQuestoes = express.Router();
const prisma = new PrismaClient();

// er - ExpressRouter.
// Procurar
// ---------------------------------------------------------------->
erBDQuestoes.get('/quantidade', async (req, res) => {
  try {
    await logged(req.headers);
    const result = await prisma.net_materialdidaticopergunta.aggregate({
      where: {
        Ativo: true,
      },
      _count: true,
    });
    const { _count } = result;
    res.json(_count);
  } catch (error) {
    //
  }
});
// ---------------------------------------------------------------->
erBDQuestoes.get('/questoes/resposta/:IDQuestao', async (req, res) => {
  try {
    await logged(req.headers);
    const { IDQuestao } = req.params;
    if (!IDQuestao) {
      sendStatus(res, 'bad_request', 'Dados incompletos.');
      return;
    }
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
erBDQuestoes.get('/:pageSize/:offset/:materia', async (req, res) => {
  try {
    await logged(req.headers);
    const { pageSize, offset, materia } = req.params;
    if (!pageSize || !offset) {
      sendStatus(res, 'bad_request', 'Dados incompletos.');
      return;
    }
    // console.log({ materia });
    res.json(await getQuestoes(Number(materia), Number(pageSize), Number(offset)));
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});

export default erBDQuestoes;
