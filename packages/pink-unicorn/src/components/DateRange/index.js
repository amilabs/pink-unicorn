import 'daterangepicker/daterangepicker.css'
import { Component, createRef } from 'react'
import { Input } from 'reactstrap'
import DateRangePicker from 'daterangepicker'
import moment from 'moment'
import { parseDateInterval } from '../../utils'

export default class DateRange extends Component {
  control = createRef()

  componentDidMount() {
    const interval = parseDateInterval(this.props.value, true, this.props.utc)

    this.$picker = new DateRangePicker(this.control.current, {
      startDate: interval[0],
      endDate: interval[1],
      minDate: this.props.minDate,
      maxDate: this.props.maxDate || (this.props.utc ? moment.utc() : moment()).startOf('days').add(1, 'day').toDate(),
      timePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      timePicker24Hour: true,
      timePickerSeconds: true,
      alwaysShowCalendars: true,
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

      // 'This hour': [now.clone().startOf('hour'), now.clone().endOf('hour')],
      // 'Last hour': [now.clone().subtract(1, 'hour').startOf('hour'), now.clone().subtract(1, 'hour').endOf('hour')],
      // 'Today': [now.clone().startOf('days'), now.clone().endOf('days')],
      // 'Last 24 Hours': [now.clone().subtract(24, 'hours'), now.clone()],
      // 'Yesterday': [now.clone().subtract(1, 'days').startOf('days'), now.clone().subtract(1, 'days').endOf('days')],
      // 'Last 7 Days': [now.clone().subtract(6, 'days').startOf('days'), now.clone().endOf('days')],
      // 'Last 30 Days': [now.clone().subtract(29, 'days').startOf('days'), now.clone().endOf('days')],
      // 'This Month': [now.clone().startOf('month'), now.clone().endOf('month')],
      // 'Last Month': [now.clone().subtract(1, 'month').startOf('month'), now.clone().subtract(1, 'month').endOf('month')],
      // 'Last 3 Month': [now.clone().subtract(3, 'month').startOf('month'), now.clone().subtract(1, 'month').endOf('month')],
      // 'Last 6 Month': [now.clone().subtract(6, 'month').startOf('month'), now.clone().subtract(1, 'month').endOf('month')],
    }
  }

  handleApply = (event, picker) => {
    const value = picker.startDate.format('YYYY-MM-DD HH:mm:ss') + ' - ' +
      picker.endDate.format('YYYY-MM-DD HH:mm:ss')

    this.props.onChange(value)
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
    return (
      <Input
        id={this.props.id}
        name={this.props.name}
        disabled={this.props.disabled}
        style={this.props.style}
        innerRef={this.control}
        bsSize={this.props.bsSize}
        type="search"
        autoComplete="off"
        value={String(this.props.value || '')}
        onChange={this.handleChange}
      />
    );
  }
}
