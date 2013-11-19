###
  backbone-http.js 0.5.2
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
###

# ensure the client symbols are resolved
if window? and require.shim
  require.shim([
    {symbol: '_', path: 'lodash', alias: 'underscore', optional: true}, {symbol: '_', path: 'underscore'}
    {symbol: 'Backbone', path: 'backbone'}
    {symbol: 'moment', path: 'moment'}
    {symbol: 'inflection', path: 'inflection'}
    {symbol: 'stream', path: 'stream', optional: true} # stream is large so it is optional on the client
    {symbol: 'Backbone.ORM', symbol_path: 'backbone.ORM', path: 'backbone-orm'}
    {symbol: 'superagent', path: 'superagent'}
  ])

module.exports =
  sync: require './sync'

  # re-expose modules
  modules:
    'backbone-orm': bborm = require 'backbone-orm'
    'superagent': require 'superagent'

for path in ['url', 'querystring', 'lru-cache', 'underscore', 'backbone', 'moment', 'inflection', 'stream']
  module.exports.modules[path] = bborm.modules[path]
