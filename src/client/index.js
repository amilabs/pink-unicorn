import './assets/style/index.scss'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './containers/App'

render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('app'))
