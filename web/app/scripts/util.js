const SECOND = 1000,
      MINUTE = SECOND * 60,
      HOUR = MINUTE * 60,
      DAY = HOUR * 24,
      MONTH = DAY * 30,
      YEAR = MONTH * 12;

const elapseTime = (end, start) => {
  const elapse = end - start;
  let number, unit = '';
  
  if ((number = elapse / YEAR) >= 1) 
    unit = 'year';
  else if ((number = elapse / MONTH) >= 1)
    unit = 'month';
  else if ((number = elapse / DAY) >= 1)
    unit = 'day';
  else if ((number = elapse / HOUR) >= 1)
    unit = 'hour';
  else if ((number = elapse / MINUTE) >= 1)
    unit = 'min';
  else if ((number = elapse / SECOND) >= 1)
    unit = 'sec';
  else 
    number = 1, unit = 'sec';

  return `${Math.floor(number)} ${unit}`;
};
