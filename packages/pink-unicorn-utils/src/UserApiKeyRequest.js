import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { split } from 'moment-range-split'
import { get } from 'lodash'
import ApiRequest from './ApiRequest'

const moment = extendMoment(Moment)

export default class UserApiKeyRequest {
  constructor (requestFactory) {
    this._requests = []
    this._requestFactory = requestFactory
  }

  _sendRequest (props) {
    const aggType = props.agg_type

    this._requests.push(
      this._requestFactory('getCounterByKey', {
        ...props,
        type: 'keys',
        agg_type: aggType === 'D' ? 'auto' : aggType,
      })
    )

    this._requests.push(
      this._requestFactory('getStatsByKey', {
        ...props,
        type: 'stats_key',
        agg_type: aggType === 'D' ? 'auto' : aggType,
      })
    )

    if (aggType === 'H') {
      const startTo = moment.utc(props.to * 1000)
      const startFrom = moment.max(
        moment.utc().startOf('hour').subtract(5, 'hours'),
        moment.utc(props.from * 1000),
      )

      if (startTo.isAfter(startFrom)) {
        this._requests.push(
          this._requestFactory('getCounterByKey', {
            ...props,
            type: 'keys',
            agg_type: 'M',
            from: startFrom.unix(),
            to: startTo.unix(),
          })
        )

        this._requests.push(
          this._requestFactory('getStatsByKey', {
            ...props,
            type: 'stats_key',
            agg_type: 'M',
            from: startFrom.unix(),
            to: startTo.unix(),
          })
        )
      }

      const endTo = moment.min(
        moment.utc(props.from * 1000).startOf('hour').add(1, 'hour'),
        moment.utc(props.to * 1000),
      )
      const endFrom = moment.utc(props.from * 1000)

      if (endTo.isAfter(endFrom) && !endFrom.clone().startOf('hour').isSame(endFrom)) {
        this._requests.push(
          this._requestFactory('getCounterByKey', {
            ...props,
            type: 'keys',
            agg_type: 'M',
            from: endFrom.unix(),
            to: endTo.unix(),
          })
        )

        this._requests.push(
          this._requestFactory('getStatsByKey', {
            ...props,
            type: 'stats_key',
            agg_type: 'M',
            from: endFrom.unix(),
            to: endTo.unix(),
          })
        )
      }
    }

    return Promise.all(this._requests.map(item => item.fetch()))
      .then(([ dataSkip, dataCount, skipEndMinutes, countEndMinutes, skipStartMinutes, countStartMinutes ]) => {
        this._requests = []

        const requests = {
          dataSkip,
          dataCount,
          skipEndMinutes,
          countEndMinutes,
          skipStartMinutes,
          countStartMinutes,
        }

        if (aggType === 'M') {
          // дозапрос в часах с конца, если нет минут
          // @todo не надо запрашивать если нет данных
          const startDataTime = get(dataSkip, 'M[0].time', props.to)
          if ((startDataTime - props.from) > 60 * 60 * 1000) {
            const request = this._requestFactory('getCounterByKey', {
              ...props,
              type: 'keys',
              agg_type: 'H',
              from: props.from,
              to: startDataTime,
            })

            this._requests.push(request)

            requests.dataSkip = request.fetch()
              .then(dataByHours => Object.assign(dataSkip, dataByHours))
          }
        }

        if (aggType === 'M') {
          const startDataTime = get(dataCount, 'M[0].time', props.to)
          if ((startDataTime - props.from) > 60 * 60 * 1000) {
            const request = this._requestFactory('getStatsByKey', {
              ...props,
              type: 'stats_key',
              agg_type: 'H',
              from: props.from,
              to: startDataTime,
            })

            this._requests.push(request)

            requests.dataCount = request.fetch()
              .then(dataByHours => Object.assign(dataCount, dataByHours))
          }
        }

        return Promise.all(Object.values(requests))
      })
  }

  _createDataset (data, props) {
    let [ dataSkip, dataCount, skipEndMinutes, countEndMinutes, skipStartMinutes, countStartMinutes ] = data

    skipEndMinutes = skipEndMinutes && ApiRequest.responseReduce(skipEndMinutes, props)
    countEndMinutes = countEndMinutes && ApiRequest.responseReduce(countEndMinutes, props)
    skipStartMinutes = skipStartMinutes && ApiRequest.responseReduce(skipStartMinutes, props)
    countStartMinutes = countStartMinutes && ApiRequest.responseReduce(countStartMinutes, props)
    dataSkip = ApiRequest.responseReduce(dataSkip, props)
    dataCount = ApiRequest.responseReduce(dataCount, props)

    if (skipEndMinutes) {
      for (const time in skipEndMinutes.dataSource) {
        if (!dataSkip.dataSource[time]) {
          dataSkip.dataSource[time] = skipEndMinutes.dataSource[time]
        }
      }
    }

    if (countEndMinutes) {
      for (const time in countEndMinutes.dataSource) {
        if (!dataCount.dataSource[time]) {
          dataCount.dataSource[time] = countEndMinutes.dataSource[time]
        }
      }
    }

    if (skipStartMinutes) {
      for (const time in skipStartMinutes.dataSource) {
        if (!dataSkip.dataSource[time]) {
          dataSkip.dataSource[time] = skipStartMinutes.dataSource[time]
        }
      }
    }

    if (countStartMinutes) {
      for (const time in countStartMinutes.dataSource) {
        if (!dataCount.dataSource[time]) {
          dataCount.dataSource[time] = countStartMinutes.dataSource[time]
        }
      }
    }

    const source = []
    let prevSkip = 0
    for (let idx = 0, len = dataSkip.timeSource.length; idx < len; idx++) {
      const item = dataSkip.timeSource[idx]
      const tsEnd = +item.end

      if (!+idx) {
        const tsStart = +item.start
        prevSkip = Number(get(dataSkip.dataSource[tsStart], 'skip', 0))

        source.push([
          tsStart,
          Number(get(dataCount.dataSource[tsStart], 'count', 0)),
          prevSkip,
        ])
      }

      let skip = Number(get(dataSkip.dataSource[tsEnd], 'skip', 0))
      let nextSkip

      if (idx < len - 1) {
        const nextItem = dataSkip.timeSource[idx + 1]
        const nextTsEnd = +nextItem.end
        nextSkip = Number(get(dataSkip.dataSource[nextTsEnd], 'skip', 0))
      }

      if (!(skip || prevSkip || nextSkip)) {
        skip = null
      }

      source.push([
        tsEnd,
        Number(get(dataCount.dataSource[tsEnd], 'count', 0)),
        skip,
      ])

      prevSkip = skip
    }

    return source
  }

  cancel () {
    this._requests.forEach(item => (item.cancel && item.cancel()))
    this._requests = []
  }

  fetch (props) {
    this.cancel()
    return this._sendRequest(props)
      .then(data => this._createDataset(data, props))
  }
}
