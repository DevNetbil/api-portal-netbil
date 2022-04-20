import { PrismaClient } from '.prisma/client';
import dateFormatter from '../../dateFormatter';

const prisma = new PrismaClient();
// ---------------------------------------------------------------->
type RegistroParams = {
    ID: number;
    DataCadastro: Date;
    IDEscola: number;
    IDTurma: number;
    IDALuno: number;
    Atividade: string | null;
    Objetivos: string | null;
}
// ---------------------------------------------------------------->
type RegistroReturn = {
    ID: number;
    DataCadastro: string;
    Atividade: string | null;
    Objetivos: string | null;
    Aluno: {
        ID: number;
        Nome: string;
    };
    Turma: {
        ID: number;
        Nome: string;
    };
    Escola: {
        ID: number;
        Nome: string;
    };
}
// ---------------------------------------------------------------->
const genReturnRegistros = async (registroxpedagogico:RegistroParams[]) => {
  try {
    if (registroxpedagogico.length === 0) {
      return [];
    }
    const rfinal: RegistroReturn[] = [];
    // ---------------------------------------------------------------->
    const alunos = await prisma.net_acessorestrito.findMany({
      select: { ID: true, Nome: true },
      where: { ID: { in: registroxpedagogico.map((element) => Number(element.IDALuno)) } },
    });
      // ---------------------------------------------------------------->
    const turmas = await prisma.net_turmas.findMany({
      include: {
        net_tipoensino: true,
        net_series: true,
        net_tiposturma: true,
        net_turnos: true,
      },
      where: { ID: { in: registroxpedagogico.map((element) => Number(element.IDTurma)) } },
    });
      // ---------------------------------------------------------------->
    const escolas = await prisma.net_escola.findMany({
      select: {
        ID: true,
        Nome: true,
      },
      where: { ID: { in: registroxpedagogico.map((element) => Number(element.IDEscola)) } },
    });
      // ---------------------------------------------------------------->
    registroxpedagogico.forEach(async (element) => {
      const escola = escolas.filter((esc) => esc.ID === element.IDEscola);
      const turma = turmas.filter((esc) => esc.ID === element.IDTurma);
      const aluno = alunos.filter((esc) => esc.ID === element.IDALuno);
      const obj = {
        ID: element.ID,
        DataCadastro: dateFormatter(element.DataCadastro, 'onlyDate'),
        Atividade: element.Atividade,
        Objetivos: element.Objetivos,
        Aluno: {
          ID: aluno[0].ID,
          Nome: aluno[0].Nome,
        },
        Turma: {
          ID: turma[0].ID,
          Nome: `${turma[0].net_tipoensino.Tipo}-${turma[0].net_series.Serie}-${turma[0].net_tiposturma.Tipo}-${turma[0].net_turnos.Turno}`,
        },
        Escola: {
          ID: escola[0].ID,
          Nome: escola[0].Nome,
        },
      };
      rfinal.push(obj);
    });
    return rfinal;
  } catch (error) {
    //
  }
};

export default genReturnRegistros;
