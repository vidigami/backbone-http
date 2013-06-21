util = require 'util'
_ = @_ or require 'underscore'

Cursor = require 'backbone-orm/lib/cursor'

module.exports = class AjaxCursor extends Cursor

  ##############################################
  # Execution of the Query
  ##############################################
  toJSON: (callback, count) ->
    # build query
    query = _.extend(_.extend({}, @_find), @_cursor)
    query.$count = true if count

    @request
      .get(@url)
      .query(query)
      .set('Accept', 'application/json')
      .end (err, res) =>
        return callback(err) if err
        return callback(new Error "Ajax failed with status #{status} for #{method}") unless res.ok
        callback(null, if query.$count then res.body.result else res.body)
