import '@amilabs/pink-unicorn/src/style/index.scss'
import { render } from 'react-dom'
import { App } from '@amilabs/pink-unicorn'
import routes, { menu } from './routes'

render((
  <App
    routes={routes}
    menu={menu}
  />
), document.getElementById('app'))
