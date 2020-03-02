import 'pink-unicorn/src/style/index.scss'
import { render } from 'react-dom'
import { App } from 'pink-unicorn'
import routes, { menu } from './routes'

render((
  <App
    routes={routes}
    menu={menu}
  />
), document.getElementById('app'))
