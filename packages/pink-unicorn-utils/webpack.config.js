const path = require('path')
const webpack = require('webpack')
const isPropuction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isPropuction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'pul',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { loose: true, modules: false }],
              '@babel/preset-flow',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-function-bind',
              '@babel/plugin-proposal-function-sent',
              ['@babel/plugin-proposal-optional-chaining', { loose: false }],
              ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-do-expressions',
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-private-methods', { loose: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-transform-classes', { loose: true }]
            ]
          }
        }
      },
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  ],
}
