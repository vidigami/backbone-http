###
  backbone-http.js 0.6.0
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
###

BackboneORM = require 'backbone-orm'

module.exports =
  sync: require './sync'
  _: BackboneORM._
  Backbone: BackboneORM.Backbone

  # re-expose modules
  modules:
    'backbone-orm': BackboneORM

for path in ['url', 'querystring', 'lru-cache', 'underscore', 'backbone', 'moment', 'inflection', 'stream']
  module.exports.modules[path] = BackboneORM.modules[path]
