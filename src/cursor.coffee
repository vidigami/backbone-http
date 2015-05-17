###
  backbone-http.js 0.7.2
  Copyright (c) 2013-2014 Vidigami
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/vidigami/backbone-http
  Dependencies: Backbone.js and Underscore.js.
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
      return callback(err) if err
      callback(null, if (@hasCursorQuery('$count') or @hasCursorQuery('$exists')) then res.result else res)
