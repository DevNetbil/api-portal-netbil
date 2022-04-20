import moment from 'moment';

const dateFormatter = (date: Date | string, type:'full'|'onlyDate'|'onlyTime') => {
  const dateMoment = moment(date).locale('pt-br').format('L');
  const timeMoment = moment(date).locale('pt-br').format('LT');
  if (type === 'onlyDate') {
    return `${dateMoment}`;
  }
  if (type === 'onlyTime') {
    return `${timeMoment}`;
  }
  return `${dateMoment} ${timeMoment}`;
};
export default dateFormatter;
