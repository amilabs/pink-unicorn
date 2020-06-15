// import 'daterangepicker/daterangepicker.css'
import { Component, createRef, cloneElement } from 'react'
import DateRangePicker from 'daterangepicker'
import moment from 'moment'
import parseDateInterval from './parseDateInterval'
import formatDateInterval from './formatDateInterval'

class IntervalDatePicker extends DateRangePicker {
  clickRange (e) {
    const label = e.target.getAttribute('data-range-key')
    this.chosenLabel = label

    if (label == this.locale.customRangeLabel) {
      this.showCalendars()
    } else {
      const dates = this.ranges[label]
      this.startDate = dates[0]
      this.endDate = dates[1]

      if (!this.timePicker) {
        this.startDate.startOf('day')
        this.endDate.endOf('day')
      }

      if (!this.alwaysShowCalendars) {
        this.hideCalendars()
      }

      this.updateView()
    }
  }
}

export default class DateRange extends Component {
  control = createRef()

  componentDidMount() {
    const interval = Array.isArray(this.props.value) ? this.props.value : parseDateInterval(this.props.value, true, this.props.utc)
    const minDate = this.minDate()
    const maxDate = this.maxDate()
    const startDate = minDate && interval[0] ? moment.max(minDate, interval[0]) : interval[0]
    const endDate = maxDate && interval[1] ? moment.min(maxDate, interval[1]) : interval[1]

    this.$picker = new IntervalDatePicker(this.control.current, {
      startDate,
      endDate,
      minDate,
      maxDate,
      autoApply: false,
      timePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      timePicker24Hour: true,
      timePickerSeconds: true,
      alwaysShowCalendars: true,
      showCustomRangeLabel: false,
      locale: {
        format: 'YYYY-MM-DD HH:mm:ss',
        cancelLabel: 'Clear'
      },
      ranges: this.customRanges()
    });

    this.$picker.element.on('cancel.daterangepicker', this.handleCancel)
    this.$picker.element.on('apply.daterangepicker', this.handleApply)
    this.$picker.element.on('show.daterangepicker', this.handleShow)
  }

  componentWillUnmount() {
    this.$picker.remove()
  }

  maxDate () {
    return this.props.maxDate || (this.props.utc ? moment.utc() : moment()).startOf('days').add(1, 'day').toDate()
  }

  minDate () {
    return this.props.minDate
  }

  customRanges() {
    const now = this.props.utc ? moment.utc() : moment()
    const allNow = now.clone().startOf('days').add(1, 'day')
    return {
      'This hour': [now.clone().startOf('hour'), now.clone().startOf('hour').add(1, 'hour')],
      'Last hour': [now.clone().subtract(1, 'hour').startOf('hour'), now.clone().subtract(1, 'hour').startOf('hour').add(1, 'hour')],
      Today: [now.clone().startOf('days'), allNow.clone()],
      'Last 24 Hours': [now.clone().subtract(24, 'hours'), now.clone()],
      Yesterday: [now.clone().subtract(1, 'days').startOf('days'), now.clone().subtract(1, 'days').startOf('days').add(1, 'day')],
      'Last 7 Days': [now.clone().subtract(6, 'days').startOf('days'), allNow.clone()],
      'Last 30 Days': [now.clone().subtract(29, 'days').startOf('days'), allNow.clone()],
      'This Month': [now.clone().startOf('month'), now.clone().startOf('month').add(1, 'month')],
      'Last Month': [now.clone().subtract(1, 'month').startOf('days'), allNow.clone()],
      'Last 3 Month': [now.clone().subtract(3, 'month').startOf('days'), allNow.clone()],
      'Last 6 Month': [now.clone().subtract(6, 'month').startOf('days'), allNow.clone()],
    }
  }

  handleApply = (event, picker) => {
    const minDate = this.minDate()
    const maxDate = this.maxDate()
    let startDate = minDate ? moment.max(minDate, picker.startDate) : picker.startDate
    let endDate = maxDate ? moment.min(maxDate, picker.endDate) : picker.endDate

    startDate = this.props.utc ? moment.utc(startDate) : moment(startDate)
    endDate = this.props.utc ? moment.utc(endDate) : moment(endDate)

    this.props.onChange(`${startDate.format('YYYY-MM-DD HH:mm:ss')} - ${endDate.format('YYYY-MM-DD HH:mm:ss')}`)
  }

  handleCancel = (event, picker) => {
    const now = this.props.utc ? moment.utc() : moment()
    this.props.onChange('')
    picker.setStartDate(now.clone().startOf('days').toDate())
    picker.setEndDate(now.clone().endOf('days').toDate())
  }

  handleChange = (event) => {
    const interval = parseDateInterval(event.target.value, true, this.props.utc)
    this.$picker.hide()
    this.$picker.setStartDate(interval[0])
    this.$picker.setEndDate(interval[1])
    this.props.onChange(event.target.value)
  }

  handleShow = () => {
    this.$picker.ranges = this.customRanges()
  }

  render() {
    const value = Array.isArray(this.props.value) ?
      formatDateInterval(this.props.value[0], this.props.value[1], this.props.utc) :
      this.props.value

    return cloneElement(this.props.children, {
      ref: this.control,
      bsSize: this.props.bsSize,
      type: 'search',
      autoComplete: 'off',
      value: String(value || ''),
      onChange: this.handleChange,
    })
  }
}
