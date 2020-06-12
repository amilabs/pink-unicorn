import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { split } from 'moment-range-split'
import { isEmpty } from 'lodash'

const moment = extendMoment(Moment)

const defaultSampling = (out, item, key) => {
  out[ key ] = out[ key ] || { skip: 0, count: 0 }
  out[ key ].skip += Number(item.skip || 0)
  out[ key ].count += Number(item.count || 0)
  return out
}

export default class ApiRequest {
  static responseReduce (data, props, sampling = defaultSampling) {
    let startOfType = 'days'
    switch (props.agg_type) {
      case 'D':
        startOfType = 'days'
        break
      case 'H':
        startOfType = 'hours'
        break
      case 'M':
        startOfType = 'minutes'
        break
    }

    const range = moment.range(
      moment.utc(props.from * 1000),
      moment.utc(props.to * 1000).startOf(startOfType).add(1, startOfType)
    )
    let timeSource = split(range, startOfType)
    let dataSource = {}

    if (!isEmpty(data.M)) {
      dataSource = data.M.reduce((out, item) => {
        const time = moment.utc(item.time * 1000).startOf(startOfType).valueOf()
        return sampling(out, item, time)
      }, dataSource)
    }

    if (!isEmpty(data.H)) {
      if (props.agg_type === 'M') {
        dataSource = data.H.reduce((out, item) => {
          const startTime = moment.utc(item.time * 1000 - 60 * 60 * 1000)
          const endTime = moment.utc(item.time * 1000)
          const avgItem = {
            ...item,
            count: Math.round(item.count / 60),
            skip: Math.round(item.skip / 60),
          }
          split(moment.range(startTime, endTime), 'minutes').forEach((mItem, idx) => {
            const tsStart = mItem.start.valueOf()
            sampling(out, avgItem, tsStart)
          })
          return out
        }, dataSource)

      } else {
        dataSource = data.H.reduce((out, item) => {
          const time = moment.utc(item.time * 1000).startOf(startOfType).valueOf()
          return sampling(out, item, time)
        }, dataSource)
      }
    }

    if (!isEmpty(data.D)) {
      dataSource = data.D.reduce((out, item) => {
        const time = moment.utc(item.time * 1000).startOf(startOfType).valueOf()
        return sampling(out, item, time)
      }, dataSource)
    }

    return { dataSource, timeSource }
  }
}
