import { Component } from 'react'
import { Alert, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import natsort from 'natsort'
import {
  Table,
  TableCellJson,
  TableCellBool,
  TableCellInt,
} from 'pink-unicorn'

class CollectionView extends Component {

  static getInitialState () {
    return {
      loading: false,
      error: null,
      data: [],
    }
  }

  columns = [
    {
      Header: 'Key',
      accessor: 'id',
      width: 200,
    },
    {
      Header: 'JSON',
      accessor: 'json',
      width: null,
      Cell: TableCellJson,
      disableSortBy: true,
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
      nextState.error !== this.state.error
    )
  }

  handleFetchData = () => {
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

  render () {
    return (
      <>
        <h1 className="mb-4">List</h1>
        {this.state.loading}

        <Table
          loading={this.state.loading}
          columns={this.columns}
          data={this.state.data}
          fixed={true}
          onFetchData={this.handleFetchData}
        />
      </>
    )
  }
}

export default CollectionView
