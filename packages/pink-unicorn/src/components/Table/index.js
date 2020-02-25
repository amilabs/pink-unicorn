import { useEffect } from 'react'
import { useTable, useAsyncDebounce, useSortBy } from 'react-table'
import { Table as BootstrapTable, Spinner } from 'reactstrap'
import { isNumber } from 'lodash'
import classnames from 'classnames'
import { formatNum } from '../../utils'
import style from './index.module.scss'

export function TableCellJson ({ cell }) {
  return (
    <code>{JSON.stringify(cell.value)}</code>
  )
}

export function TableCellBool ({ cell }) {
  return (
    <div className="text-center">{cell.value ? '+' : null}</div>
  )
}

export function TableCellInt ({ cell }) {
  return (
    <div className="text-right">{isNumber(cell.value) ? formatNum(cell.value) : ''}</div>
  )
}

export default function Table ({ columns, data, onFetchData, globalFilter, loading }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
  } = useTable({
    columns,
    data,
  }, useSortBy)

  // const onFetchDataDebounced = useAsyncDebounce(onFetchData, 200)

  useEffect(() => {
    onFetchData({ globalFilter })
  }, [ globalFilter ])

  return (
    <div className={style.root}>
      <BootstrapTable
        className={classnames({
          'mb-0': true,
          [ style.loading ]: loading,
        })}
        size="sm"
        hover
        striped
        responsive
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} width={column.width}>
                  {column.render('Header')}
                  {column.isSorted ? column.isSortedDesc ?
                    <i className="fas fa-angle-down ml-2" /> :
                    <i className="fas fa-angle-up ml-2" /> : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </BootstrapTable>
      {loading && !rows.length ? (
        <div className="flex-fill d-flex align-items-center justify-content-center">
          <Spinner color="secondary" />
        </div>
      ) : (!loading && !rows.length) ? (
        <div className="flex-fill d-flex align-items-center justify-content-center">
          No data
        </div>
      ) : null}
    </div>
  )
}
