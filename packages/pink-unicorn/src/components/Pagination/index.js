import classnames from 'classnames'
import { formatNum } from '../../utils'

export default function Pagination ({
  className,
  onPageClick,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  disabled = false,
  pageNavigation = true,
  fastNavigation = true,
  fastFullNavigation = false,
  relative = false,
  alwaysFastFirst = false,
  delta = 2,
}) {
  const pageCount = Math.ceil(total / pageSize)
  currentPage = currentPage === 'last' ? pageCount : currentPage
  currentPage = currentPage > pageCount ? 1 : currentPage
  const showPages = !relative && pageNavigation
  const pages = showPages && pageCount ? generatePageRange(currentPage, pageCount, delta) : []
  const pagePrevDisabled = currentPage === 1 || !pageCount || disabled
  const pageNextDisabled = currentPage === pageCount || !pageCount || disabled
  const pageFirstDisabled = disabled || !pageCount || (currentPage === 1 && !alwaysFastFirst)

  return (
    <nav aria-label="Page navigation">
      <ul className={classnames([ 'pagination mb-0', className ])}>
        {fastFullNavigation && (
          <li
            className={classnames({
              'page-item': true,
              'disabled': pageFirstDisabled,
            })}
          >
            <a
              className={classnames({
                'page-link border-0 rounded rounded-lg mx-1': true,
              })}
              href="#"
              aria-label="First"
              tabIndex={pageFirstDisabled ? '-1' : undefined}
              aria-disabled={pageFirstDisabled ? 'true' : undefined}
              onClick={event => {
                event.preventDefault()
                onPageClick('first')
              }}
            >
              First
            </a>
          </li>
        )}

        {fastNavigation && (
          <li
            className={classnames({
              'page-item': true,
              'disabled': pagePrevDisabled,
            })}
          >
            <a
              className={classnames({
                'page-link border-0 rounded rounded-lg mx-1': true,
              })}
              href="#"
              tabIndex={pagePrevDisabled ? '-1' : undefined}
              aria-disabled={pagePrevDisabled ? 'true' : undefined}
              onClick={event => {
                event.preventDefault()
                onPageClick(relative ? 'prev' : currentPage - 1)
              }}
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="d-none d-sm-inline ml-sm-1">Previous</span>
            </a>
          </li>
        )}

        {showPages ? pages.map((page, idx) => {
          const isActive = page === currentPage && !disabled
          const isDisabled = page === '...' || disabled
          return (
            <li
              key={`${page}-${idx}`}
              className={classnames({
                'page-item': true,
                'active': isActive,
                'disabled': isDisabled,
              })}
            >
              <a
                className={classnames({
                  'page-link border-0 rounded rounded-lg mx-1': true,
                })}
                href="#"
                tabIndex={isDisabled ? '-1' : undefined}
                aria-disabled={isDisabled ? 'true' : undefined}
                onClick={event => {
                  event.preventDefault()
                  onPageClick(page)
                }}
              >
                {page}
              </a>
            </li>
          )
        }) : pageCount ? (
          <li className="page-item disabled">
            <a className="page-link border-0 rounded rounded-lg mx-1" href="#" tabIndex="-1" aria-disabled="true">
              <nobr>{formatNum(currentPage)} / {formatNum(pageCount)}</nobr>
            </a>
          </li>
        ) : null}

        {fastNavigation && (
          <li
            className={classnames({
              'page-item': true,
              'disabled': pageNextDisabled,
            })}
          >
            <a
              className={classnames({
                'page-link border-0 rounded rounded-lg mx-1': true,
              })}
              href="#"
              tabIndex={pageNextDisabled ? '-1' : undefined}
              aria-disabled={pageNextDisabled ? 'true' : undefined}
              onClick={event => {
                event.preventDefault()
                onPageClick(relative ? 'next' : currentPage + 1)
              }}
            >
              <span className="d-none d-sm-inline mr-sm-1">Next</span>
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        )}

        {fastFullNavigation && (
          <li
            className={classnames({
              'page-item': true,
              'disabled': pageNextDisabled,
            })}
          >
            <a
              className={classnames({
                'page-link border-0 rounded rounded-lg mx-1': true,
              })}
              href="#"
              aria-label="Last"
              tabIndex={pageNextDisabled ? '-1' : undefined}
              aria-disabled={pageNextDisabled ? 'true' : undefined}
              onClick={event => {
                event.preventDefault()
                onPageClick('last')
              }}
            >
              Last
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}

function generatePageRange (currentPage, pageCount, delta = 2) {
  const range = []
  for (let i = Math.max(2, (currentPage - delta)); i <= Math.min((pageCount - 1), (currentPage + delta)); i += 1) {
    range.push(i)
  }

  if ((currentPage - delta) > 2) {
    range.unshift('...')
  }

  if ((currentPage + delta) < (pageCount - 1)) {
    range.push('...')
  }

  range.unshift(1)
  if (pageCount !== 1) {
    range.push(pageCount)
  }

  return range
}

