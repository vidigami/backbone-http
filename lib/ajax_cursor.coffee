request = @superagent or require 'superagent'
_ = @_ or require 'underscore'

Cursor = require 'backbone-orm/lib/cursor'

module.exports = class AjaxCursor extends Cursor

  ##############################################
  # Execution of the Query
  ##############################################
  toJSON: (callback, count) ->
    query = _.extend(_.extend({}, @_find), @_cursor)
    request(@url)
      .query(query)
      .end (err, res) ->
        return callback(err) if err
        return callback(new Error "Ajax failed with status #{status} for #{method}") unless res.ok
        callback(null, res.body)
