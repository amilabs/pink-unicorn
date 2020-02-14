import 'pink-unicorn/src/style/index.scss'
import { render } from 'react-dom'
import { App } from 'pink-unicorn'
import routes from './routes'

const collections = []

render((
  <App
    routes={routes}
    collections={collections}
  />
), document.getElementById('app'))
