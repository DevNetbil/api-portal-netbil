import express, {
  Router,
} from 'express';

import cors from 'cors';
import helmet from 'helmet';
import rtBancoQuestoes from './src/routes/bancoQuestoes';
import rtAgendas from './src/routes/agenda';
import rtError from './src/routes/error';
import rtRegistros from './src/routes/registros';
import rtAppPortalNetbil from './src/routes/appPortalNetbil';
import rtFilter from './src/routes/filter';
import rtLogin from './src/routes/login';

const router = Router();

router.use(helmet());
router.use(cors());

router.use(express.json());
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

router.use('/agendas', rtAgendas);
router.use('/login', rtLogin);
router.use('/registros', rtRegistros);
router.use('/error', rtError);
router.use('/filter', rtFilter);
router.use('/app/portalnetbil', rtAppPortalNetbil);
router.use('/banco-de-questoes', rtBancoQuestoes);

// eslint-disable-next-line import/prefer-default-export
export { router };
