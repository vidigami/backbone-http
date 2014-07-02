fs = require 'fs'
path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../../webpack/base-config.coffee'), {
  entry: './src/index.coffee'
  output:
    path: '.'
    filename: 'backbone-http.js'
    library: 'kb'
    libraryTarget: 'umd'

  externals: [
    {jquery: {root: 'jQuery', amd: 'jquery', commonjs: 'jquery', commonjs2: 'jquery'}}
    {underscore: {root: '_', amd: 'underscore', commonjs: 'underscore', commonjs2: 'underscore'}}
    {backbone: {root: 'Backbone', amd: 'backbone', commonjs: 'backbone', commonjs2: 'backbone'}}
    {'backbone-orm': {root: 'BackboneORM', amd: 'backbone-orm', commonjs: 'backbone-orm', commonjs2: 'backbone-orm'}}
    {moment: 'moment'}
    {stream: 'stream'}
    {superagent: 'superagent'}
  ]
}
