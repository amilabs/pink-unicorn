import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

export default function predefinedState (state, props) {
    const from = moment.utc(props.from * 1000)
    const to = moment.utc(props.to * 1000)
    const range = moment.range(from, to)
    const diffHours = range.diff('hours', true)
    const diffDays = range.diff('days', true)
    const diffMonths = range.diff('months', true)

    state = {
      ...state,
    }

    // <=3h: Group=Minutes & Grouping=0
    if (diffHours <= 3) {
      state.aggType = 'M'
      state.group = 0

    // >3h && <=24h: Group=Minutes & Grouping=5
    } else if (diffHours <= 24) {
      state.aggType = 'M'
      state.group = 5

    // >24h && <7days: Group=Minutes & Grouping=10
    } else if (diffDays < 7) {
      state.aggType = 'M'
      state.group = 10

    // >=7days && <2M: Group=Hours
    } else if (diffMonths < 2) {
      state.aggType = 'H'
      state.group = 0

    // >=2M: Group=Days
    } else {
      state.aggType = 'D'
      state.group = 0
    }

    state.userRange = (
      diffHours === 1 ? '1H' :
      diffDays === 1 ? '1D' :
      diffMonths === 1 ? '1M' :
      diffMonths === 3 ? '3M' :
      diffMonths === 12 ? '1Y' : null
    )

    return state
  }
