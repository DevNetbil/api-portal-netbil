import { PrismaClient } from '@prisma/client';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import erAgendas from './routes/agenda';
import erError from './routes/error';
import rtRegistros from './routes/registros';
import erAppPortalNetbil from './routes/appPortalNetbil';
import logged from './functions/logged';
import rtFilter from './routes/filter';
import erLogin from './routes/login';
import erBDQuestoes from './routes/bancoQuestoes';

export const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// app.get('/:what', async (_req, res) => {
//   const data = moment().locale('pt-br').tz('America/Sao_Paulo').format('L');
//   const time = moment().locale('pt-br').tz('America/Sao_Paulo').format('LT');
//   //   const resultLogged = await logged(_req.headers);
//   //   console.log("LOGADO ->", resultLogged);
//   //   const resultado = await prisma.
//   //   const resultado = await prisma.net_escola.findMany({});
//   console.log('headers', _req.headers);
//   res.json([data, time]);
// });

// app.get(`/:what/:second`, async (_req, res) => {
//   res.redirect(200, `/${_req.params.what}/${_req.params.second}`);
//   const data = moment().locale("pt-br").tz("America/Sao_Paulo").format("L");
//   const time = moment().locale("pt-br").tz("America/Sao_Paulo").format("LT");
//   const resultLogged = await logged(_req.headers);
//   console.log("LOGADO ->", resultLogged);
//   res.json([data, time, "second"]);
// });

app.use('/agendas', erAgendas);
app.use('/login', erLogin);
app.use('/registros', rtRegistros);
app.use('/error', erError);
app.use('/filter', rtFilter);
app.use('/app/portalnetbil', erAppPortalNetbil);
app.use('/banco-de-questoes', erBDQuestoes);

export default app;
