import 'daterangepicker/daterangepicker.css'
import { Component, createRef } from 'react'
import { Input } from 'reactstrap'
import DateRangePicker from 'daterangepicker'
import moment from 'moment'
import { parseDateInterval } from '../../utils'

export default class DateRange extends Component {
  control = createRef()

  componentDidMount() {
    const interval = parseDateInterval(this.props.value)

    this.$picker = new DateRangePicker(this.control.current, {
      startDate: interval[0],
      endDate: interval[1],
      timePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      timePicker24Hour: true,
      timePickerSeconds: true,
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
    return {
      'Last hour': [moment().subtract(1, 'hour').startOf('hour'), moment().subtract(1, 'hour').endOf('hour')],
      'This hour': [moment().startOf('hour'), moment().endOf('hour')],
      'Today': [moment().startOf('days'), moment().endOf('days')],
      'Last 24 Hours': [moment().subtract(24, 'hours'), moment()],
      'Yesterday': [moment().subtract(1, 'days').startOf('days'), moment().subtract(1, 'days').endOf('days')],
      'Last 7 Days': [moment().subtract(6, 'days').startOf('days'), moment().endOf('days')],
      'Last 30 Days': [moment().subtract(29, 'days').startOf('days'), moment().endOf('days')],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'Last 3 Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(3, 'month').endOf('month')],
      'Last 6 Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(6, 'month').endOf('month')],
    }
  }

  handleApply = (event, picker) => {
    const value = picker.startDate.format('YYYY-MM-DD HH:mm:ss') + ' - ' +
      picker.endDate.format('YYYY-MM-DD HH:mm:ss')

    this.props.onChange(value)
  }

  handleCancel = (event, picker) => {
    this.props.onChange('')
    picker.setStartDate(moment().startOf('days').toDate())
    picker.setEndDate(moment().endOf('days').toDate())
  }

  handleChange = (event) => {
    const interval = parseDateInterval(event.target.value)
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
