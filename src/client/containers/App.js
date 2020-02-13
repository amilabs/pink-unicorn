import { Component } from 'react'
import { withRouter } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import routes from '@/routes'
import Navbar from '@/components/Navbar'
import NoMatch from '@/components/NoMatch'
import ErrorBoundary from '@/components/ErrorBoundary'

class App extends Component {
  render () {
    return (
      <>
        <Navbar />
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
    )
  }
}

export default withRouter(App)
