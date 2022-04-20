import moment from 'moment-timezone';

const years = (type: 'firstDayMonthYear'|'lastDayMonthYear') => {
  if (type === 'firstDayMonthYear') {
    const stringYear = `${moment()
      .tz('America/Sao_Paulo')
      .format('YYYY')}-01-01`;
    return new Date(stringYear);
  }
  const stringYear = `${moment()
    .tz('America/Sao_Paulo')
    .format('YYYY')}-12-31`;
  return new Date(stringYear);
};

export default years;
