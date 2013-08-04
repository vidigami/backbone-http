util = require 'util'
_ = require 'underscore'

Cursor = require 'backbone-orm/lib/cursor'

module.exports = class AjaxCursor extends Cursor

  ##############################################
  # Execution of the Query
  ##############################################
  toJSON: (callback, options) ->
    count = (@_cursor.$count or (options and options.$count))
    exists = @_cursor.$exists or (options and options.$exists)

    # build query
    query = _.extend(_.extend({}, @_find), @_cursor)

    query.$count = true if count
    query.$exists = true if exists
    @request
      .get(@url)
      .query(query)
      .type('json')
      .end (err, res) =>
        return callback(err) if err
        return callback(null, null) if query.$one and (res.status is 404) # not found
        return callback(new Error "Ajax failed with status #{res.status} with: #{util.inspect(res.body)}") unless res.ok
        callback(null, if (count or exists) then res.body.result else res.body)
