path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../../webpack/base-config.coffee'), {
  entry: './test/suite.coffee'
  output:
    path: '.'
    filename: '_temp/webpack/backbone-http.tests.js'

  externals: [
    {chai: 'chai'}
  ]
}

module.exports.resolve.alias =
  'backbone-http': path.resolve('./backbone-http.js')
