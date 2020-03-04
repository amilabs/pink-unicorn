import { useEffect, useState, useMemo, Fragment } from 'react'
import { useTable, useAsyncDebounce, useSortBy, useFilters } from 'react-table'
import { Table as BootstrapTable, Spinner, Button, Collapse, Input } from 'reactstrap'
import { isNumber, debounce } from 'lodash'
import classnames from 'classnames'
import { formatNum } from '../../utils'
import style from './index.module.scss'

export function TableCellJson ({ cell }) {
  const [ collapsed, setCollapsed ] = useState(false)

  return (
    <Fragment>
      <Collapse
        isOpen={!collapsed}
      >
        <code className={style.tableCellJson}>
          {JSON.stringify(cell.value)}
          <Button
            color="link"
            size="sm"
            className={style.tableCellJsonExpand}
            onClick={() => setCollapsed(true)}
          >
            expand
          </Button>
        </code>
      </Collapse>
      <Collapse
        isOpen={collapsed}
        className={style.tableCellJsonCollapsed}
      >
        <code>{JSON.stringify(cell.value)}</code>
        <Button
          color="link"
          size="sm"
          className={style.tableCellJsonCollapse}
          onClick={() => setCollapsed(false)}
        >
          collapse
        </Button>
      </Collapse>
    </Fragment>
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

export function ColumnFilterText (callback) {
  callback = debounce(callback, 400)
  return ({
    column: { filterValue, preFilteredRows, setFilter },
  }) => {
    return (
      <Input
        type="search"
        bsSize="sm"
        value={filterValue || ''}
        onChange={event => {
          const value = event.target.value || undefined
          setFilter(value)
          callback?.(value)
        }}
        placeholder={`Search records...`}
      />
    )
  }
}

const defaultPropGetter = () => ({})

export default function Table ({
  columns,
  data,
  onFetchData,
  globalFilter,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  loading = false,
  fixed = false,
}) {
  const defaultColumn = useMemo(
    () => ({
      Filter: () => (null),
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      manualFilters: true,
    },
    useFilters,
    useSortBy
  )

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
          [ style.fixed ]: fixed,
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
                <th
                  {...column.getHeaderProps([
                    {
                      className: column.className,
                      style: column.style,
                      width: column.width,
                    },
                    getColumnProps(column),
                    getHeaderProps(column),
                    column.getSortByToggleProps()
                  ])}
                >
                  {column.render('Header')}
                  {column.isSorted ? column.isSortedDesc ?
                    <i className="fas fa-angle-down ml-2" /> :
                    <i className="fas fa-angle-up ml-2" /> : null}
                  {column.canFilter ? (
                    <div className="mt-1" onClick={event => event.stopPropagation()}>
                      {column.render('Filter')}
                    </div>
                  ) : null}
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
