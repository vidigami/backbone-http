###
  backbone-http.js 0.0.1
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js and Underscore.js.
###

# ensure the client symbols are resolved
require('backbone-orm/lib/client_utils').loadDependencies([{symbol: 'superagent', path: 'superagent'}])

module.exports =
  sync: require './sync'
