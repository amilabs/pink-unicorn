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
  // externals: /^(moment|lodash)$/i,
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  ],
}
