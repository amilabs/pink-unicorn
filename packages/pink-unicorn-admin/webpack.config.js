require('dotenv').config()

const merge = require('webpack-merge')
const common = require('@amilabs/pink-unicorn/webpack.config')
const config = merge(common, {})

module.exports = config
