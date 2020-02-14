import { withRouter } from 'react-router'
import { Switch, Route, HashRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'
import NoMatch from '../components/NoMatch'
import ErrorBoundary from '../components/ErrorBoundary'

const AppRouter = withRouter(({
  routes = [],
  collections = [],
} = {}) => (
  <>
    <Navbar collections={collections} />
    <div className="container-fluid d-flex flex-fill flex-column my-4">
      <ErrorBoundary>
        <Switch>
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </ErrorBoundary>
    </div>
  </>
))

const App = props => (
  <HashRouter>
    <AppRouter {...props} />
  </HashRouter>
)

export default App
