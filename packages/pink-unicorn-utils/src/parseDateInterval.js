import trim from 'lodash/trim'
import parseDate from './parseDate'

export default function parseDateInterval (value, strict = true, utc = false) {
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
