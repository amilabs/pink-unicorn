import moment from 'moment'
import formatNum from './formatNum'

export default class UserApiKeyChart {
  constructor (state, zoom) {
    this.state = state || {}
    this.zoom = zoom || []

    this.tooltipItems = [
      ['Request', value => (!value ? '-' : formatNum(value)), 1],
      ['Exceeded', value => (!value ? '-' : formatNum(value)), 2],
    ];

    this.dimensions = [
      { name: 'time', type: 'time', displayName: 'Time' },
      { name: 'count', type: 'number', displayName: 'Count' },
      { name: 'skip', type: 'number', displayName: 'Exceeded' },
    ];
  }

  tooltipFormatter = (params) => {
    const items = this.tooltipItems.map(item => {
      const param = params.find(p => p.seriesName === item[0])
      if (!param) {
        return ''
      }

      const value = param?.value?.[item[2]]
      return (
        `<tr>
          <td>${param.marker}&nbsp;<b>${item[0]}:</b>&nbsp;</td>
          <td align="right" width="100">${item[1] ? item[1](value) : (value === null ? '-' : value)}</td>
        </tr>`
      )
    })

    const time = params?.[0]?.value?.[0]
    const startTime = params?.[0]?.startValue?.[0]
    let date

    if (this.state.aggType === 'D') {
      if (startTime) {
        date = `${moment.utc(startTime).format('YYYY-MM-DD')} - ${moment.utc(time).format('YYYY-MM-DD')}`
      } else {
        date = moment.utc(time).format('YYYY-MM-DD')
      }
    } else {
      if (startTime) {
        date = `${moment(startTime).format('YYYY-MM-DD HH:mm')} - ${moment(time).format('YYYY-MM-DD HH:mm')}`
      } else {
        date = moment(time).format('YYYY-MM-DD HH:mm')
      }
    }

    return (
      `<div style="line-height: 18px;">
        <div>${date}</div>
        <table class="text-white">
        ${items.join('')}
        </table>
      </div>`
    )
  }

  axisXFormatter = value => (
    this.state.aggType === 'D' ?
      moment.utc(value).format('D. MMM') :
      moment(value).format('D. MMM, HH:mm')
  )

  axisXPointerFormatter = data => (
    this.state.aggType === 'D' ?
      moment.utc(data.value).format('D. MMM') :
      moment(data.value).format('D. MMM, HH:mm')
  )

  dataZoomFormatter = value => (
    this.state.aggType === 'D' ?
      moment(value).format('D. MMM') :
      moment(value).format('HH:mm[\n]D. MMM')
  )

  axisYFormatter = data => formatNum(data.value)

  sample = (value, dim) => {
    switch (dim) {
      case 'count':
      case 'skip':
        return this.sampleSum(value)
      default:
        return value
    }
  }

  sampleSum (frame) {
    var sum = 0;
    for (var i = 0; i < frame.length; i++) {
      sum += frame[i] || 0;
    }
    return sum;
  }

  getChartOptions () {
    return {
      useUTC: true,
      grid: {
        top: 20,
        bottom: 35,
        left: 50,
        right: 50,
        containLabel: true
      },
      tooltip: {
        show: true,
        showContent: true,
        trigger: 'axis',
        animation: false,
        transitionDuration: 1,
        confine: true,
        enterable: false,
        padding: [5, 10],
        axisPointer: { type: 'cross' },
        formatter: this.tooltipFormatter,
      },
      toolbox: {
        show: true,
        itemSize: 0,
        height: 0,
        feature: {
          dataZoom: {
            show: true,
            filterMode: 'none',
            yAxisIndex: 'none',
            title: {
              zoom: 'Zoom',
              back: 'Zoom Reset',
            },
          },
          restore: {
            show: true,
            title: 'Restore',
          },
        }
      },
      legend: {
        data: [
          { name: 'Request' },
          { name: 'Exceeded' },
        ],
        top: -5,
        itemHeight: 0,
        itemWidth: 16,
        textStyle: {
          fontSize: 14,
          lineHeight: 16
        }
      },
      dataZoom: [
        {
          type: 'slider',
          start: this.zoom.length ? this.zoom[0] : 0,
          end: this.zoom.length ? this.zoom[1] : 100,
          minValueSpan: 2 * 60 * 60 * 1000,
          bottom: 0,
          labelFormatter: this.dataZoomFormatter,
        },
        {
          type: 'inside',
          minValueSpan: 2 * 60 * 60 * 1000,
          zoomOnMouseWheel: 'ctrl',
          moveOnMouseMove: 'ctrl',
          preventDefaultMouseMove: false,
        },
      ],
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: this.axisXFormatter,
        },
        axisPointer: {
          label: {
            formatter: this.axisXPointerFormatter,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisPointer: {
          label: {
            formatter: this.axisYFormatter,
          },
        },
      },
      series: [
        {
          animation: false,
          id: 'request',
          name: 'Request',
          type: this.state.chartType,
          smooth: this.state.smooth,
          smoothMonotone: 'x',
          ...(this.state.fill ? {
            areaStyle: { opacity: 0.15 },
          } : {
            areaStyle: { opacity: 0 },
          }),
          stack: this.state.stack ? 'stack' : undefined,
          ...(this.state.chartType === 'bar' ? {
            barCategoryGap: '20%',
            barGap: '0%',
          } : {
            barCategoryGap: undefined,
            barGap: undefined,
          }),
          ...(this.state.sampling ? {
            sampling: this.sample,
            samplingDim: ['count', 'skip'],
          } : {
            sampling: undefined,
            samplingDim: undefined,
          }),
          showSymbol: false,
          encode: {
            x: 'time',
            y: 'count',
            itemId: 'time',
          },
          dimensions: this.dimensions,
          axisLine: { lineStyle: { color: '#0056b3' } },
          axisTick: { lineStyle: { color: '#0056b3' } },
          axisLabel: { color: '#0056b3' },
          nameTextStyle: { color: '#0056b3' },
          itemStyle: { color: '#0056b3' },
          z: 3,
        },
        {
          animation: false,
          id: 'skip',
          name: 'Exceeded',
          type: this.state.chartType,
          smooth: this.state.smooth,
          smoothMonotone: 'x',
          ...(this.state.fill ? {
            areaStyle: { opacity: 0.4 },
          } : {
            areaStyle: { opacity: 0 },
          }),
          stack: this.state.stack ? 'stack' : undefined,
          ...(this.state.chartType === 'bar' ? {
            barCategoryGap: '20%',
            barGap: '0%',
          } : {
            barCategoryGap: undefined,
            barGap: undefined,
          }),
          ...(this.state.sampling ? {
            sampling: this.sample,
            samplingDim: ['count', 'skip'],
          } : {
            sampling: undefined,
            samplingDim: undefined,
          }),
          showSymbol: false,
          encode: {
            x: 'time',
            y: 'skip',
            itemId: 'time',
          },
          dimensions: this.dimensions,
          axisLine: { lineStyle: { color: '#dc3545' } },
          axisTick: { lineStyle: { color: '#dc3545' } },
          axisLabel: { color: '#dc3545' },
          nameTextStyle: { color: '#dc3545' },
          itemStyle: { color: '#dc3545' },
        },
      ],
    };
  }
}
