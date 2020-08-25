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
    const interval = Array.isArray(this.props.value) ?
      this.props.value :
      parseDateInterval(this.props.value, true, this.props.utc)

    const [ startDate, endDate ] = this.getDateInterval(interval)

    this.$picker = new IntervalDatePicker(this.control.current, {
      startDate,
      endDate,
      minDate: this.minDate(),
      maxDate: this.maxDate(),
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
        cancelLabel: 'Cancel'
      },
      ranges: this.customRanges()
    });

    this.$picker.element.on('cancel.daterangepicker', this.handleCancel)
    this.$picker.element.on('apply.daterangepicker', this.handleApply)
    this.$picker.element.on('show.daterangepicker', this.handleShow)
    this.updateControlValue()
  }

  componentWillUnmount() {
    this.$picker.remove()
  }

  componentDidUpdate (prevProps) {
    if (
      this.props.value !== prevProps.value ||
      this.props.utc !== prevProps.utc ||
      this.props.maxDate !== prevProps.maxDate ||
      this.props.minDate !== prevProps.minDate
    ) {
      this.$picker.minDate = this.minDate()
      this.$picker.maxDate = this.maxDate()

      const interval = Array.isArray(this.props.value) ?
        this.props.value :
        parseDateInterval(this.props.value, true, this.props.utc)

      const [ startDate, endDate ] = this.getDateInterval(interval)
      if (startDate) {
        this.$picker.setStartDate(startDate)
      }
      if (endDate) {
        this.$picker.setEndDate(endDate)
      }

      this.$picker.updateView()
      this.updateControlValue()
    }
  }

  dateCreate (value) {
    return value ? (this.props.utc ? moment.utc(value) : moment(value)) :
      (this.props.utc ? moment.utc() : moment())
  }

  maxDate () {
    return this.props.maxDate ?
      this.dateCreate(this.props.maxDate) :
      this.dateCreate().startOf('days').add(1, 'day')
  }

  minDate () {
    return this.props.minDate ? this.dateCreate(this.props.minDate) : null
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

  handleApply = () => {
    this.updateControlValue()
    const [startDate, endDate] = this.getDateInterval()
    if (startDate && endDate) {
      this.props.onChange(
        `${startDate.format('YYYY-MM-DD HH:mm:ss')} - ${endDate.format('YYYY-MM-DD HH:mm:ss')}`,
        [startDate, endDate]
      )
    } else {
      this.props.onChange('', [])
    }
  }

  handleCancel = (event, picker) => {
    picker.hide()
  }

  handleShow = () => {
    this.$picker.ranges = this.customRanges()
  }

  getDateInterval = (interval = [ this.$picker.startDate, this.$picker.endDate ]) => {
    const minDate = this.minDate()
    const maxDate = this.maxDate()
    let startDate = interval[0] ? this.dateCreate(interval[0]) : null
    let endDate = interval[1] ? this.dateCreate(interval[1]) : null
    endDate = maxDate && endDate ? moment.min(maxDate, endDate) : endDate
    startDate = minDate && startDate ? moment.max(minDate, startDate) : startDate
    startDate = startDate && endDate ? moment.min(startDate, endDate) : startDate || endDate
    return [startDate, endDate]
  }

  updateControlValue = () => {
    const [startDate, endDate] = this.getDateInterval()
    if (startDate && endDate) {
      this.control.current.value = `${startDate.format('YYYY-MM-DD HH:mm:ss')} - ${endDate.format('YYYY-MM-DD HH:mm:ss')}`
    } else {
      this.control.current.value = ''
    }
  }

  render() {
    return cloneElement(this.props.children, {
      ref: this.control,
      bsSize: this.props.bsSize,
      type: 'search',
      autoComplete: 'off',
      onKeyPress: (event) => {
        if (event.charCode === 13) {
          this.handleApply()
        }
      },
      onBlur: () => {
        if (!this.$picker.isShowing) {
          this.handleApply()
        }
      },
    })
  }
}
