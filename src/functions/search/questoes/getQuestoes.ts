import { PrismaClient } from '.prisma/client';
import { net_habilidade } from '@prisma/client';

const prisma = new PrismaClient();

const getQuestoes = async (
  idMateria: number,
  pageSize: number,
  offset: number,
) => {
  try {
    let questoes = await prisma.net_materialdidaticopergunta.findMany(
      {
        include: {
          net_dificuldades: { select: { dificuldades: true } },
          net_series: { select: { Serie: true } },
          net_tipoensino: { select: { Tipo: true } },
          net_unidadetematica: true,
          net_habilidadexpergunta: { select: { idHabilidade: true } },
          net_materialdidaticomaterias: { select: { Materia: true } },
        },
        where: { Ativo: true },
        take: Number(pageSize),
        skip: Number(offset),
        orderBy: {
          ID: 'desc',
        },
      },
    );
    if (idMateria !== 0) {
      questoes = await prisma.net_materialdidaticopergunta.findMany(
        {
          include: {
            net_dificuldades: { select: { dificuldades: true } },
            net_series: { select: { Serie: true } },
            net_tipoensino: { select: { Tipo: true } },
            net_unidadetematica: true,
            net_habilidadexpergunta: { select: { idHabilidade: true } },
            net_materialdidaticomaterias: { select: { Materia: true } },
          },
          where: { Ativo: true, IDMateria: idMateria },
          take: Number(pageSize),
          skip: Number(offset),
          orderBy: {
            ID: 'desc',
          },
        },
      );
    }
    // return questoes;
    let result: any[] = [];
    let habilidades: net_habilidade[] = [];
    questoes.forEach(async (element) => {
      // Buscar respostas.
      const respostas = await prisma.net_materialdidaticoresposta.findMany({
        where: { IDPergunta: element.ID },
      });
      // Buscar habilidades.
      if (element.net_habilidadexpergunta.length > 0) {
        habilidades = await prisma.net_habilidade.findMany({
          where: { id: { in: element?.net_habilidadexpergunta?.map((e) => e.idHabilidade) } },
        });
      }
      // Buscar disciplina.
      const disciplina = await prisma.net_materias.findUnique({
        where: { ID: element.IDMateria },
      });
      const objResult = {
        ID: element.ID,
        IDEnsino: element.IDEnsino,
        IDMaster: element.IDMaster,
        UnidadeTematica: element.net_unidadetematica,
        Disciplina: disciplina,
        Pergunta: element.Pergunta,
        Aprovado: element.Aprovado,
        Dificuldade: element.net_dificuldades?.dificuldades,
        Respostas: respostas,
        Habilidades: habilidades,
        Materia: element.net_materialdidaticomaterias.Materia,
        PalavraChave: element.palavraChave,
        Serie: element.net_series.Serie,
      };
      result.push(objResult);
    });
    return result;
  } catch (error) {
    throw new Error();
  }
};

export default getQuestoes;
