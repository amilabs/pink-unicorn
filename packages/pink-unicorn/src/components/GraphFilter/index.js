import { useState, useEffect } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import DateRange from '../DateRange'
import { parseDateInterval, formatDateInterval } from '../../utils'

export default function GraphFilter ({
  data,
  disabled,
  showCancel,
  className = 'mb-4',
  utc = false,
  minDate,
  maxDate,
  onChange = () => {},
  onCancel = () => {},
} = {}) {
  const [ filterData, setFilterData ] = useState(data)

  useEffect(() => {
    setFilterData(data)
  }, [data])

  const dataRange = (filterData.from && filterData.to) ?
    formatDateInterval(filterData.from * 1000, filterData.to * 1000, utc) : undefined

  return (
    <Form
      inline
      className={className}
      onSubmit={event => {
        event.preventDefault()
        onChange(filterData)
      }}
    >
      <FormGroup className="mb-2 mr-2 mb-sm-0">
        <DateRange
          id="dataRange"
          name="dataRange"
          style={{ width: 360 }}
          value={dataRange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          utc={utc}
          onChange={value => {
            value = parseDateInterval(value, true, utc)
            if (value.length === 2) {
              setFilterData({
                ...filterData,
                from: Math.floor(value[0].getTime() / 1000),
                to: Math.floor(value[1].getTime() / 1000),
              })
            } else {
              setFilterData({
                ...filterData,
                from: undefined,
                to: undefined,
              })
            }
          }}
        />
      </FormGroup>

      <FormGroup className="mb-2 mr-2 mb-sm-0">
        <Label>&nbsp;</Label>
        <Button disabled={disabled} className="form-control">Submit</Button>
      </FormGroup>

      {showCancel ? (
        <FormGroup className="mb-2 mr-2 mb-sm-0">
          <Label>&nbsp;</Label>
          <Button className="form-control" color="warning" onClick={() => onCancel()}>Cancel Request</Button>
        </FormGroup>
      ) : null}
    </Form>
  )
}
