import { padEnd, round, trim } from 'lodash'
import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function parseDate (value, utc) {
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

export function parseDateInterval (value, strict = true, utc = false) {
  value = String(value || '').split(' - ', 2);
  let start = trim(value[0], ' -:/');
  let end = trim(value[1], ' -:/');

  if (start && end) {
    start = parseDate(start, utc)[0];
    end = parseDate(end, utc)[strict ? 0 : 1];
  } else if (start) {
    const interval = parseDate(start, utc);
    start = interval[0]
    end = interval[1]
  }

  return start && end ? [start, end] : [];
}

export function formatDateInterval (from, to, utc = false) {
  if (utc) {
    return `${moment.utc(from).format(DATE_FORMAT)} - ${moment.utc(to).format(DATE_FORMAT)}`
  }

  return `${moment(from).format(DATE_FORMAT)} - ${moment(to).format(DATE_FORMAT)}`
}

/**
 * @param {number} num
 * @param {boolean} [withDecimals=false]
 * @param {number} [decimals=2]
 * @param {boolean} [cutZeroes=false]
 * @param {boolean} [forInput=false]
 */
export function formatNum(
  num,
  withDecimals = false,
  decimals = 2,
  cutZeroes = false,
  forInput = false,
) {
  num = parseFloat(num);

  if (withDecimals) {
    num = round(num, decimals);
  }

  if (isNaN(num)) {
    num = 0;
  }

  const parts = num.toString().split('.');
  let res = forInput ? parts[0].toString() : parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const zeroCount = cutZeroes ? 2 : decimals;

  if (withDecimals && decimals) {
    if (typeof (parts[1]) !== 'undefined') {
      res += '.';
      let tail = parts[1].substring(0, decimals);
      if (tail.length < zeroCount) {
        tail = padEnd(tail, zeroCount, '0');
      }
      res += tail;
    } else {
      res += padEnd('.', parseInt(zeroCount, 10) + 1, '0');
    }
  }

  return res;
}
