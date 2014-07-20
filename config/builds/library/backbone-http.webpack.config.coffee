fs = require 'fs'
path = require 'path'
_ = require 'underscore'

module.exports = _.extend {}, (require '../../webpack/base-config.coffee'), {
  entry: './src/index.coffee'
  output:
    path: '.'
    filename: 'backbone-http.js'
    library: 'BackboneHTTP'
    libraryTarget: 'umd'

  externals: [
    {jquery: {root: '$', amd: 'jquery', commonjs: 'jquery', commonjs2: 'jquery'}}
    {underscore: {root: '_', amd: 'underscore', commonjs: 'underscore', commonjs2: 'underscore'}}
    {backbone: {root: 'Backbone', amd: 'backbone', commonjs: 'backbone', commonjs2: 'backbone'}}
    {'backbone-orm': {root: 'BackboneORM', amd: 'backbone-orm', commonjs: 'backbone-orm', commonjs2: 'backbone-orm'}}
    {stream: 'stream'}
  ]
}

module.exports.resolve.alias =
  querystring: path.resolve('./node_modules/backbone-orm/config/node-dependencies/querystring.js')
  url: path.resolve('./node_modules/backbone-orm/config/node-dependencies/url.js')
