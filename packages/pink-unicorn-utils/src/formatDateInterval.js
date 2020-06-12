import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default function formatDateInterval (from, to, utc = false) {
  if (utc) {
    return `${moment.utc(from).format(DATE_FORMAT)} - ${moment.utc(to).format(DATE_FORMAT)}`
  }

  return `${moment(from).format(DATE_FORMAT)} - ${moment(to).format(DATE_FORMAT)}`
}
