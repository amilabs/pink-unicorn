# Contributing guidelines

## Running in development

### Download source and dependencies

```
# git clone git@github.com:amilabs/pink-unicorn.git
# cd pink-unicorn
# yarn install
```

### Library development

Main library is `@amilabs/pink-unicorn`. This project no need to build. Make and push changes, update library in related projects `yarn update` and changes will be in the project.

### Run example project

Demo project is `@amilabs/pink-unicorn-admin`.

To run and develop you need to install npm packages `yarn install` and run the build `yarn workspace @amilabs/pink-unicorn-admin run dev`.

After the project will be awailable on `http://localhost:3002`.


### Utils development

Project `@amilabs/pink-unicorn-utils` is the common project for all admin interfaces and can be used on another projects, such as Wallet.

Therefore this project has their own build system. Before publish changes to NPM developer have to run `yarn workspace @amilabs/pink-unicorn-utils run build` and build the project.

## Create new admin interface

Easy way to create new admin interface is to copy example project to new directory and run code below and create necessary routes, components to display and define some settings.

```
yarn install
yarn run build
```

Seccings are in `.env` file in the root folder. Can be:
- `PAGE_TITLE` - project title
- `VERSION` - project version (will put version from git if it's awailable)
- `REACT_DEV_HOST=localhost`
- `REACT_DEV_PORT=3002`
- `API_URL` - real API url to proxy request from the `/api`

Developer can define any settings and use them in the project.

Created project already has build system, which must work without any settings.
But you need to create specual/different routes for API or setup custom rules, developer can change local `webpack.config.js` file in the project.

For example:
```js
require('dotenv').config()

const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('@amilabs/pink-unicorn/webpack.config')

function proxy (name, target) {
  return {
    ['/' + name]: {
      context: () => true,
      changeOrigin: true,
      target: target,
      secure: false,
      pathRewrite: {
        ['^/' + name] : ''
      }
    }
  }
}

const config = merge(common, {
  resolve: {
    alias: {
      'pink-unicorn': '@amilabs/pink-unicorn',
      'pink-unicorn-utils': '@amilabs/pink-unicorn-utils',
    },
  },
  devServer: {
    open: true,
    proxy: {
      ...proxy('api-dev', process.env.API_DEV),
      ...proxy('api-prod', process.env.API_PROD),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(JSON.parse(process.env.CONFIG || '{}')),
      OTHER_SETTING: JSON.stringify(process.env.OTHER_SETTING),
    }),
  ]
})

module.exports = config
```

## API calls

By default all calls are made according to the swagger rules.

Before calling the service developer has to define all swagger files in `api` folder.
And define api in the code like this

```js
const envConfig = CONFIG || {} // from .env or CI
client('api', envConfig.api)
client('api', { basePath: '/api-dev', ...envConfig.dev }, 'dev') // "dev" is alias to api with some changes
client('api', { basePath: '/api-prod', ...envConfig.prod }, 'prod')
```

By default all API settings will be taken from the file from `api` folder.

```js
// this will use setitngs from api.yaml file with settings from envConfig.api
client('api')
    .then(api => api.apis.default.someCall())
    .then(data => console.log(data))

// this will use setitngs from api.yaml file with settings from envConfig.api and custom settings from define
client('dev')
    .then(api => api.apis.default.someCall())
    .then(data => console.log(data))
```

All request parameters are validated in accordance with the described rules.
