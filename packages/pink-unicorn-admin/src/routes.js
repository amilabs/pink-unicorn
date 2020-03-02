import { lazy, Suspense } from 'react'

const CollectionView = lazy(() => import(
  /* webpackChunkName: "list" */
  /* webpackMode: "lazy" */
  '@/containers/CollectionView'
))

export const menu = [
  {
    name: 'list',
    to: { pathname: '/list' },
  },
]

export default [
  {
    path: '/',
    exact: true,
    component: () => (
      <div>demo</div>
    ),
  },
  {
    path: '/list',
    component: (props) => {
      return (
        <Suspense fallback={<div />}>
          <CollectionView {...props} />
        </Suspense>
      )
    },
  },
]
