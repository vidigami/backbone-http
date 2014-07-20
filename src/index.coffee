###
  backbone-http.js 0.6.0
  Copyright (c) 2013-2014 Vidigami
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/vidigami/backbone-http
  Dependencies: Backbone.js and Underscore.js.
###

{_, Backbone} = BackboneORM = require 'backbone-orm'

module.exports = BackboneHTTP = require './core' # avoid circular dependencies
publish =
  configure: require './lib/configure'
  sync: require './sync'

  _: _
  Backbone: Backbone
publish._.extend(BackboneHTTP, publish)

# re-expose modules
BackboneHTTP.modules = {'backbone-orm': BackboneORM}
BackboneHTTP.modules[key] = value for key, value of BackboneORM.modules
