import { Component } from 'react'
import { Alert, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import {
  Table,
  TableCellJson,
  TableCellBool,
  TableCellInt,
  ColumnFilterText,
  GraphFilter,
} from '@amilabs/pink-unicorn'

class CollectionView extends Component {

  static getInitialState (a,b,c) {
    return {
      loading: false,
      error: null,
      data: [],
      globalFilter: {
        from: (new Date() - 1000000) / 1000,
        to: (new Date()) / 1000,
      },
      minDate: null,
      maxDate: null,
    }
  }

  columns = [
    {
      Header: 'Key',
      accessor: 'id',
      width: 400,
      Filter: ColumnFilterText(value => {
        this.setState({
          globalFilter: {
            ...this.state.globalFilter,
            id: value,
          }
        })
      }),
    },
    {
      Header: 'JSON',
      accessor: 'json',
      width: null,
      Cell: TableCellJson,
      disableSortBy: true,
      Filter: ColumnFilterText(value => {
        this.setState({
          globalFilter: {
            ...this.state.globalFilter,
            json: value,
          }
        })
      }),
    },
  ]

  state = CollectionView.getInitialState(this.props)

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        minDate: '2020-08-20T08:20:52.000Z',
        maxDate: '2020-08-24T06:40:54.000Z',
      })
    }, 5000)
  }

  componentWillUnmount () {
    this.isUnmounted = true
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.location.search !== this.props.location.search ||
      nextState.loading !== this.state.loading ||
      nextState.error !== this.state.error ||
      nextState.minDate !== this.state.minDate ||
      nextState.maxDate !== this.state.maxDate ||
      !isEqual(nextState.globalFilter, this.state.globalFilter)
    )
  }

  handleFetchData = (data) => {
    this.setState({ loading: true })

    setTimeout(() => {
      if (!this.isUnmounted) {
        this.setState({
          data: [
            { id: 1, json: '{}' },
            { id: 2, json: '{{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}},{{"asd":"qwe"}}}' },
          ],
          error: null,
          loading: false,
        })
      }
    }, 1000)
  }

  handleChangeFilter = (data) => {
    this.setState({
      globalFilter: {
        ...this.state.globalFilter,
        ...data,
      }
    })
  }

  handleSortBy = (data) => {
    console.log(data)
  }

  render () {
    return (
      <>
        <h1 className="mb-4">List</h1>
        {this.state.loading}

        <GraphFilter
          disabled={this.state.loading}
          data={this.state.globalFilter}
          onChange={this.handleChangeFilter}
          minDate={this.state.minDate}
          maxDate={this.state.maxDate}
        />

        <Table
          defaultSortBy="id"
          defaultSortAsc={1}
          globalFilter={this.state.globalFilter}
          loading={this.state.loading}
          columns={this.columns}
          data={this.state.data}
          fixed={true}
          manualSortBy={false}
          onFetchData={this.handleFetchData}
          onSortBy={this.handleSortBy}
        />
      </>
    )
  }
}

export default CollectionView
