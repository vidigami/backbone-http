###
  backbone-http.js 0.5.0
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
###

_ = require 'underscore'

Cursor = require('backbone-orm').Cursor
JSONUtils = require('backbone-orm').JSONUtils
Utils = require('backbone-orm').Utils

module.exports = class HTTPCursor extends Cursor

  ##############################################
  # Execution of the Query
  ##############################################
  toJSON: (callback) ->
    return callback(null, if @hasCursorQuery('$one') then null else []) if @hasCursorQuery('$zero')

    @request
      .get(@url)
      .query(query = JSONUtils.toQuery(_.extend(_.clone(@_find), @_cursor)))
      .type('json')
      .end (err, res) =>
        return callback(err) if err
        return callback(null, null) if query.$one and (res.status is 404) # not found
        return callback(new Error "Ajax failed with status #{res.status} with: #{Utils.inspect(res.body)}") unless res.ok
        result = JSONUtils.parse(res.body)
        callback(null, if (@hasCursorQuery('$count') or @hasCursorQuery('$exists')) then result.result else result)
