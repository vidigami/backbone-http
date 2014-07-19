###
  backbone-http.js 0.6.0
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
###

{_, Cursor} = require 'backbone-orm'

module.exports = class HTTPCursor extends Cursor

  ##############################################
  # Execution of the Query
  ##############################################
  toJSON: (callback) ->
    return callback(null, if @hasCursorQuery('$one') then null else []) if @hasCursorQuery('$zero')

    @sync.http 'read', null, {query: query = _.extend({}, @_find, @_cursor)}, (err, res) =>
      return callback(null, null) if query.$one and err and (err.status is 404) # not found
      callback(null, if (@hasCursorQuery('$count') or @hasCursorQuery('$exists')) then res.result else res)
