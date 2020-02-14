require('dotenv').config()

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const { DefinePlugin, ProvidePlugin, ProgressPlugin, ContextReplacementPlugin } = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const SriPlugin = require('webpack-subresource-integrity')

const gitRevisionPlugin = new GitRevisionPlugin({
  versionCommand: 'describe --tags --long --always'
})

console.log('ROOT_PATH', process.cwd())
console.log('GIT version:', gitRevisionPlugin.version())
console.log('GIT hash:', gitRevisionPlugin.commithash())

const isPropuction = process.env.NODE_ENV === 'production'
const rootPath = process.cwd()
const srcPath = path.join(rootPath, 'src')
const distPath = path.join(rootPath, 'dist')
const apiPath = path.join(rootPath, 'api')
const apiList = fs.readdirSync(apiPath)
const api = {}
for (const apiFile of apiList) {
  const filePath = path.join(apiPath, apiFile)
  const name = path.basename(filePath, '.yaml');
  const apiData = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
  api[ name ] = apiData
}

module.exports = {
  mode: isPropuction ? 'production' : 'development',
  devtool: isPropuction ? 'source-maps' : 'eval',
  entry: ['./src/index.js'],
  output: {
    path: distPath,
    publicPath: '/',
    filename: isPropuction ? 'js/[name]-[contenthash].js' : 'js/[name].js',
    chunkFilename: isPropuction ? 'js/[name]-[contenthash].js' : 'js/[name].js',
    crossOriginLoading: 'anonymous',
  },
  resolve: {
    alias: {
      '@': srcPath,
    },
    extensions: [
      '.js', '.json', '.scss'
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          srcPath,
          /node_modules\/@rikishi\/pink-unicorn/,
          /node_modules\/pink-unicorn/,
        ],
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
      {
        test: /\.(s?)css$/,
        oneOf: [
          {
            test: /\.module\.(s?)css$/,
            use: [
              {
                loader: ExtractCssChunks.loader,
                options: { hot: false, reloadAll: true },
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  sourceMap: true,
                  importLoaders: 1,
                  localsConvention: 'camelCaseOnly'
                }
              },
              'sass-loader'
            ]
          },
          {
            use: [
              ExtractCssChunks.loader,
              'css-loader',
              'sass-loader'
            ]
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              name: isPropuction ? '[hash].[ext]' : '[name].[ext]',
              outputPath: 'images/'
            }
          },
          {
            loader: 'img-loader'
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: isPropuction ? '[contenthash].[ext]' : '[name].[ext]',
          outputPath: 'fonts/'
        }
      },
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false
          }
        }
      })
    ],
    splitChunks: {
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '-',
      cacheGroups: {
        'v-style': {
          name: 'v-style',
          test (module) {
            return module.type === 'css/extract-css-chunks' && /[\\/]node_modules[\\/]/.test(module.context);
          },
          enforce: true,
          chunks: 'all',
          priority: 200
        },
        'style': {
          name: 'style',
          test (module) {
            return module.type === 'css/extract-css-chunks' && !/[\\/]node_modules[\\/]/.test(module.context);
          },
          enforce: true,
          chunks: 'all',
          priority: 100
        },
        echarts: {
          name: 'echarts',
          test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
          priority: 50,
          enforce: true,
          chunks: 'all',
          reuseExistingChunk: true,
        },
        'vendors': {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          enforce: true,
          chunks: 'all',
          reuseExistingChunk: true,
        },
        default: {
          priority: -20,
          reuseExistingChunk: true,
          chunks: 'async',
        }
      }
    }
  },
  devServer: {
    host: process.env.REACT_DEV_HOST || 'localhost',
    port: process.env.REACT_DEV_PORT || 3000,
    noInfo: true,
    hot: false,
    compress: false,
    clientLogLevel: 'warning',
    open: false,
    openPage: '',
    writeToDisk: true,
    proxy: {
      '/api': {
        context: () => true,
        changeOrigin: true,
        target: process.env.API_URL,
        secure: false,
        pathRewrite: {'^/api' : ''}
      }
    },
    headers: {
      'Content-Security-Policy-Report-Only': [
        'default-src \'self\' data:;',
        'style-src-elem \'self\' \'unsafe-inline\';',
        'style-src \'self\' \'unsafe-inline\';',
        'font-src \'self\';',
        'script-src \'self\' \'unsafe-inline\';',
        'img-src \'self\' data:;',
        'connect-src \'self\';',
        'media-src \'self\' data:;',
        'object-src \'none\';',
        'frame-src \'none\';',
        'block-all-mixed-content;',
        `report-uri /ssr;`
      ].join(' ')
    },
  },
  plugins: [
    new ProgressPlugin(),
    new CleanWebpackPlugin(),
    gitRevisionPlugin,
    new DefinePlugin({
      'VERSION': JSON.stringify(gitRevisionPlugin.version()),
      'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
      'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
      'ONEAPI': JSON.stringify(api),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ProvidePlugin({
      'React': 'react',
      'ReactDOM': 'react-dom',
    }),
    new ExtractCssChunks({
      filename: isPropuction ? 'css/[name]-[contenthash].css' : 'css/[name].css',
      chunkFilename: isPropuction ? 'css/[name]-[contenthash].css' : 'css/[name].css',
      orderWarning: true,
    }),
    (isPropuction ?
      new BundleAnalyzerPlugin({ analyzerMode: 'static' }) :
      null
    ),
    new ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: process.env.PAGE_TITLE,
    }),
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: isPropuction
    })
  ].filter(function (item) {
    return item !== null;
  })
}
