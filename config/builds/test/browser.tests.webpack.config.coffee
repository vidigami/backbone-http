path = require 'path'
_ = require 'underscore'

resolveModule = (module_name) -> path.relative('.', require.resolve(module_name))

module.exports = _.extend {}, (require '../../webpack/base-config.coffee'), {
  entry: ['./test/parameters.coffee'].concat((require '../../files').tests_browser)
  output:
    filename: 'browser.tests.js'
  externals: [
    {chai: 'chai'}
  ]
}

module.exports.resolve.alias =
  'backbone-http': path.resolve('./backbone-http.js')
  'backbone-orm': path.resolve(path.join('.', resolveModule('backbone-orm')))
  querystring: path.resolve('./config/node-dependencies/querystring.js')
  url: path.resolve('./config/node-dependencies/url.js')
  stream: path.resolve(path.join('.', resolveModule('backbone-orm'), '..', './stream.js'))
