request = @superagent or require 'superagent'
_ = @_ or require 'underscore'

AjaxCursor = require './lib/ajax_cursor'
Schema = require 'backbone-orm/lib/schema'

module.exports = class AjaxBackboneSync

  constructor: (@model_type) ->
    throw new Error 'Missing url for model' unless @url = _.result((new @model_type()), 'url')

    # publish methods and sync on model
    @model_type._sync = @
    @model_type._schema = new Schema(@model_type)

  initialize: (model) ->
    return if @is_initialized; @is_initialized = true
    @model_type._schema.initialize()

  sync: -> return @

  ###################################
  # Backbone ORM - Class Extensions
  ###################################
  cursor: (query={}) -> return new AjaxCursor(query, {model_type: @model_type, url: @url})

  destroy: (query, callback) ->
    request(@url)
      .del()
      .query(query)
      .end (err, res) ->
        return callback(err) if err
        return callback(new Error "Ajax failed with status #{status} for #{method}") unless res.ok
        callback(null, res.body)

  schema: (key) -> @model_type._schema
  relation: (key) -> @model_type._schema.relation(key)


module.exports = (model_type, cache) ->
  sync = new AjaxBackboneSync(model_type)

  sync_fn = (method, model, options={}) ->
    sync['initialize']()

    return module.exports.apply(null, Array::slice.call(arguments, 1)) if method is 'createSync' # create a new sync

    if method is 'cursor' or method is 'destroy'
      return sync[method].apply(sync, Array::slice.call(arguments, 1))

    url = options.url or _.result(model, 'url')
    req = request(url)

    ###################################
    # Classic Backbone Sync
    ###################################
    switch method
      when 'create'
        req = req.post(options.attrs or model.toJSON(options)).type('json')
      when 'update'
        req = req.put(options.attrs or model.toJSON(options)).type('json')
      when 'patch'
        req = req.patch(options.attrs or model.toJSON(options)).type('json')
      when 'delete'
        req = req.del()
      when 'read'
        req = req.get().type('json')
      else
        throw new Error "Unrecognized sync method: #{method}"

    req.end (err, res) ->
      return options.error(err) if err
      return options.error(new Error "Ajax failed with status #{status} for #{method}") unless res.ok
      options.success(res.body)

  require('backbone-orm/lib/model_extensions')(model_type, sync_fn) # mixin extensions
  return if cache then require('backbone-orm/cache_sync')(model_type, sync_fn) else sync_fn