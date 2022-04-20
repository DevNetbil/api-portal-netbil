import { PrismaClient } from '@prisma/client';
import getEscolasByDiretor from '../escolas/getEscolasByDiretor';
import getEscolasByMaster from '../escolas/getEscolasByMaster';
import years from '../../years';

const prisma = new PrismaClient();
// ---------------------------------------------------------------->
type ParamsFilter = {
    IDMaster: number | undefined,
    IDEscola: number | undefined,
    IDTurma: number | undefined,
    IDProfessor: number | undefined,
    IDAluno: number | undefined,
    DataInicio: string | undefined,
    DataFim: string | undefined
}
// ---------------------------------------------------------------->
const getRegistrosByUser = async (
  idPerfil: number,
  idUser: number,
  keyword: string | undefined,
  params: ParamsFilter | undefined,
) => {
  let DataI: Date | undefined;
  let DataF: Date | undefined;
  if (params?.DataInicio) {
    const objInicial = params?.DataInicio.split('/');
    DataI = new Date(`${objInicial[2]}-${objInicial[1]}-${objInicial[0]}`);
  }
  if (params?.DataFim) {
    const objInicial = params?.DataFim.split('/');
    DataF = new Date(`${objInicial[2]}-${objInicial[1]}-${objInicial[0]}`);
  }
  switch (idPerfil) {
    case 1:
      // ---------------------------------------------------------------->
      // Pega todos os registro do netbil.
      let IDMaster;
      if (params?.IDMaster) {
        IDMaster = await prisma.net_acessorestrito.findUnique({
          select: { ID: true },
          where: { ID: params?.IDMaster },
        });
      }
      const registroNetbil = await prisma.net_registropedagogico.findMany({
        select: {
          ID: true,
          DataCadastro: true,
          IDEscola: true,
          IDTurma: true,
          IDALuno: true,
          Atividade: true,
          Objetivos: true,
        },
        orderBy: { DataCadastro: 'desc' },
        where: {
          AND: {
            DataCadastro: { gte: DataI },
          },
          DataCadastro: { lte: DataF },
          Atividade: { contains: keyword },
          Objetivos: { contains: keyword },
          IDUsuario: IDMaster?.ID,
          IDEscola: params?.IDEscola,
          IDALuno: params?.IDAluno,
          IDProfessor: params?.IDProfessor,
          IDTurma: params?.IDTurma,
        },
      });
      return registroNetbil;
    case 2:
      // ---------------------------------------------------------------->
      // Pega todos os registros do master.
      const escolasxmaster = await getEscolasByMaster(idUser);
      const registroMaster = await prisma.net_registropedagogico.findMany({
        select: {
          ID: true,
          DataCadastro: true,
          IDEscola: true,
          IDTurma: true,
          IDALuno: true,
          Atividade: true,
          Objetivos: true,
        },
        where: {
          AND: {
            DataCadastro: { gte: params?.DataInicio ? DataI : years('firstDayMonthYear') },
          },
          DataCadastro: { lte: params?.DataFim ? DataF : years('lastDayMonthYear') },
          Atividade: { contains: keyword },
          Objetivos: { contains: keyword },
          IDEscola: params?.IDEscola ? params.IDEscola
            : { in: escolasxmaster.map((esc) => esc.ID) },
          IDALuno: params?.IDAluno,
          IDProfessor: params?.IDProfessor,
          IDTurma: params?.IDTurma,
        },
        orderBy: { DataCadastro: 'desc' },

      });
      return registroMaster;
    case 3:
      // ---------------------------------------------------------------->
      //  Pega todos os registros do diretor.
      const escolaxusuario = await getEscolasByDiretor(idUser);
      let registroDiretor = await prisma.net_registropedagogico.findMany({
        select: {
          ID: true,
          DataCadastro: true,
          IDEscola: true,
          IDTurma: true,
          IDALuno: true,
          Atividade: true,
          Objetivos: true,
        },
        where: {
          AND: {
            DataCadastro: { gte: params?.DataInicio ? DataI : years('firstDayMonthYear') },
          },
          DataCadastro: { lte: params?.DataFim ? DataF : years('lastDayMonthYear') },
          Atividade: { contains: keyword },
          Objetivos: { contains: keyword },
          IDEscola: params?.IDEscola ? params.IDEscola
            : { in: escolaxusuario.map((esc) => esc.ID) },
          IDALuno: params?.IDAluno,
          IDProfessor: params?.IDProfessor,
          IDTurma: params?.IDTurma,
        },
        orderBy: { DataCadastro: 'desc' },
      });
      return registroDiretor;
    case 4:
      // ---------------------------------------------------------------->
      // Pega todos os registros do professor.
      const registroProfessor = await prisma.net_registropedagogico.findMany({
        select: {
          ID: true,
          DataCadastro: true,
          IDEscola: true,
          IDTurma: true,
          IDALuno: true,
          Atividade: true,
          Objetivos: true,
        },
        where: {
          AND: {
            DataCadastro: { gte: params?.DataInicio ? DataI : years('firstDayMonthYear') },
          },
          DataCadastro: { lte: params?.DataFim ? DataF : years('lastDayMonthYear') },
          Atividade: { contains: keyword },
          Objetivos: { contains: keyword },
          IDUsuario: idUser,
          IDEscola: params?.IDEscola,
          IDALuno: params?.IDAluno,
          IDProfessor: idUser,
          IDTurma: params?.IDTurma,
        },
        orderBy: { DataCadastro: 'desc' },
      });
      return registroProfessor;
    case 5:
      // ---------------------------------------------------------------->
      //  Pega todos os registros do responsável.
      const responsavelxaluno = await prisma.net_responsavelxaluno.findMany({
        where: { IDResponsavel: idUser },
      });
      const registroResponsavel = await prisma.net_registropedagogico.findMany({
        select: {
          ID: true,
          DataCadastro: true,
          IDEscola: true,
          IDTurma: true,
          IDALuno: true,
          Atividade: true,
          Objetivos: true,
        },
        where: {
          AND: {
            DataCadastro: { gte: params?.DataInicio ? DataI : years('firstDayMonthYear') },
          },
          DataCadastro: { lte: params?.DataFim ? DataF : years('lastDayMonthYear') },
          Atividade: { contains: keyword },
          Objetivos: { contains: keyword },
          IDALuno: params?.IDAluno
            ? params.IDAluno : { in: responsavelxaluno.map((element) => element.IDAluno) },
        },
        orderBy: { DataCadastro: 'desc' },
      });
      return registroResponsavel;

    case 6:
      // ---------------------------------------------------------------->
      // Pega todos os registros do aluno.
      const registroAluno = await prisma.net_registropedagogico.findMany({
        select: {
          ID: true,
          DataCadastro: true,
          IDEscola: true,
          IDTurma: true,
          IDALuno: true,
          Atividade: true,
          Objetivos: true,
        },
        where: {
          AND: {
            DataCadastro: { gte: params?.DataInicio ? DataI : years('firstDayMonthYear') },
          },
          DataCadastro: { lte: params?.DataFim ? DataF : years('lastDayMonthYear') },
          Atividade: { contains: keyword },
          Objetivos: { contains: keyword },
          IDALuno: idUser,
        },
        orderBy: { DataCadastro: 'desc' },
      });
      //   Se existe parametros.
      return registroAluno;
    default:
      return [];
  }
};

export default getRegistrosByUser;
