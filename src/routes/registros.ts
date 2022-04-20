import express from 'express';
import logged from '../functions/logged';
import genReturnRegistros from '../functions/search/registros/genReturnRegistros';
import getRegistrosByUser from '../functions/search/registros/getRegistrosByUser';
import sendStatus from '../functions/sendStatus';

const rtRegistros = express.Router();

// er - ExpressRouter.
//
// ---------------------------------------------------------------->
// Procurar todos registros pelos filtros.

rtRegistros.post('/buscar', async (req, res) => {
  try {
    const { params } = req.body;
    console.log({ params });
    const objParams = {
      IDMaster: params.IDMaster === '' ? undefined : Number(params.IDMaster),
      IDEscola: params.IDEscola === '' ? undefined : Number(params.IDEscola),
      IDTurma: params.IDTurma === '' ? undefined : Number(params.IDTurma),
      IDProfessor: params.IDProfessor === '' ? undefined : Number(params.IDProfessor),
      IDAluno: params.IDAluno === '' ? undefined : Number(params.IDAluno),
      DataInicio: params.DataInicio === '' ? undefined : params.DataInicio,
      DataFim: params.DataFim === '' ? undefined : params.DataFim,
    };
    console.log({ objParams });
    const infoUser = await logged(req.headers);
    const registroxpedagogico = await getRegistrosByUser(
      infoUser.IDPerfil,
      infoUser.ID,
      undefined,
      objParams,
    );
    console.log({ registroxpedagogico });
    console.log('final', await genReturnRegistros(registroxpedagogico));
    res.json(await genReturnRegistros(registroxpedagogico));
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
// Buscar todos os registros por nível de acesso.
rtRegistros.get('/', async (req, res) => {
  try {
    const infoUser = await logged(req.headers);
    const registroxpedagogico = await getRegistrosByUser(
      infoUser.IDPerfil,
      infoUser.ID,
      undefined,
      undefined,
    );
    res.json(await genReturnRegistros(registroxpedagogico));
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
// Buscar palavras chaves.
rtRegistros.get('/keyword/:Keyword', async (req, res) => {
  try {
    const infoUser = await logged(req.headers);
    const { Keyword } = req.params;
    const registroxpedagogico = await getRegistrosByUser(
      infoUser.IDPerfil,
      infoUser.ID,
      Keyword,
      undefined,
    );
    res.json(await genReturnRegistros(registroxpedagogico));
  } catch (error) {
    sendStatus(res, '', String(error instanceof Error && error.message));
  }
});
// ---------------------------------------------------------------->
export default rtRegistros;
