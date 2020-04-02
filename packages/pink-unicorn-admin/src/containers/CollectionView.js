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
} from 'pink-unicorn'

class CollectionView extends Component {

  static getInitialState () {
    return {
      loading: false,
      error: null,
      data: [],
      globalFilter: {},
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

  componentWillUnmount () {
    this.isUnmounted = true
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.location.search !== this.props.location.search ||
      nextState.loading !== this.state.loading ||
      nextState.error !== this.state.error ||
      !isEqual(nextState.globalFilter, this.state.globalFilter)
    )
  }

  handleFetchData = (data) => {
    this.setState({ loading: true })

    console.log(data)

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

  handleSortBy = (data) => {
    console.log(data)
  }

  render () {
    return (
      <>
        <h1 className="mb-4">List</h1>
        {this.state.loading}

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
