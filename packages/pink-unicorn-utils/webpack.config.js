const path = require('path')
const webpack = require('webpack')
const isPropuction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isPropuction ? 'production' : 'development',
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'commonjs2'
  },
  // externals: /^(moment|lodash)$/i,
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  ],
}
