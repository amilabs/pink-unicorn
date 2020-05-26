import { useState, useEffect } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import DateRange from '../DateRange'
import { parseDateInterval, formatDateInterval } from '../../utils'

export default function GlobalFilter ({
  data,
  disabled,
  sortOptions = [
    { label: 'count', value: 'count' },
    { label: 'skip', value: 'skip' },
  ],
  showCancel,
  onChange = () => {},
  onCancel = () => {},
} = {}) {
  const [ filterData, setFilterData ] = useState(data)

  useEffect(() => {
    setFilterData(data)
  }, [data.type])

  const dataRange = formatDateInterval(filterData.from * 1000, filterData.to * 1000)

  return (
    <Form
      inline
      className="mb-4"
      onSubmit={event => {
        event.preventDefault()
        onChange(filterData)
      }}
    >
      {sortOptions.length ? (
        <FormGroup className="mb-2 mr-2 mb-sm-0">
          <Label for="sort" className="mr-2">Order</Label>
          <Input
            value={filterData.sort}
            type="select"
            name="sort"
            id="sort"
            disabled={disabled}
            onChange={event => {
              setFilterData({
                ...filterData,
                sort: event.target.value,
              })
            }}
          >
            {sortOptions.map(item => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </Input>
        </FormGroup>
      ) : null}

      <FormGroup className="mb-2 mr-2 mb-sm-0">
        <Label for="dataRange" className="mr-2">From</Label>
        <DateRange
          id="dataRange"
          name="dataRange"
          style={{ width: 360 }}
          value={dataRange}
          disabled={disabled}
          onChange={value => {
            value = parseDateInterval(value)
            if (value.length === 2) {
              setFilterData({
                ...filterData,
                from: Math.floor(value[0].getTime() / 1000),
                to: Math.floor(value[1].getTime() / 1000),
              })
            }
          }}
        />
      </FormGroup>

      <FormGroup className="mb-2 mr-2 mb-sm-0">
        <Label for="limit" className="mr-2">Limit</Label>
        <Input
          value={filterData.limit}
          type="number"
          min="0"
          name="limit"
          id="limit"
          disabled={disabled}
          onChange={event => {
            setFilterData({
              ...filterData,
              limit: Number(event.target.value || 0),
            })
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
