import moment from 'moment'

export default function parseDate (value, utc) {
  const formats = [
    [['DD-MM-YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY HH:mm:ss'], 'seconds'],
    [['DD-MM-YYYY HH:mm', 'YYYY-MM-DD HH:mm', 'DD/MM/YYYY HH:mm'], 'minutes'],
    [['DD-MM-YYYY HH', 'YYYY-MM-DD HH', 'DD/MM/YYYY HH'], 'hours'],
    [['DD-MM-YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY'], 'days'],
    [['MM-YYYY', 'YYYY-MM', 'YYYY/MM', 'MM/YYYY'], 'months'],
    [['YYYY'], 'years'],
    [['HH:mm:ss'], 'seconds'],
    [['HH:mm'], 'minutes'],
    [['HH'], 'hours']
  ];

  let start;
  let end;
  for (let i = 0; i < formats.length; i++) {
    const date = utc ? moment.utc(value, formats[i][0], true) : moment(value, formats[i][0], true);
    if (date.isValid()) {
      const round = formats[i][1];
      start = date.startOf(round).toDate();
      end = date.add(1, round).startOf(round).toDate();
      break;
    }
  }

  return start && end ? [start, end] : [];
}
