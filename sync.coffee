util = require 'util'
_ = require 'underscore'

AjaxCursor = require './lib/ajax_cursor'
Schema = require 'backbone-orm/lib/schema'
Utils = require 'backbone-orm/lib/utils'
JSONUtils = require 'backbone-orm/lib/json_utils'

module.exports = class AjaxSync

  constructor: (@model_type) ->
    throw new Error("Missing url for model") unless @url = _.result(@model_type.prototype, 'url')

    # publish methods and sync on model
    @model_type.model_name = Utils.parseUrl(@url).model_name unless @model_type.model_name # model_name can be manually set
    throw new Error('Missing model_name for model') unless @model_type.model_name
    @schema = new Schema(@model_type)
    @request = require 'superagent'

  initialize: (model) ->
    return if @is_initialized; @is_initialized = true
    @schema.initialize()

    ###################################
    # TEST: override request
    ###################################
    @request = require('./lib/test_utils').mockRequest(@model_type) if process?.env.NODE_ENV is 'test'

  ###################################
  # Backbone ORM - Class Extensions
  ###################################
  # @private
  resetSchema: (options, callback) ->
    @request
      .del(@url)
      .end (err, res) ->
        return callback(err) if err
        return callback(new Error "Ajax failed with status #{res.status} for #{'destroy'} with: #{util.inspect(res.body)}") unless res.ok
        callback()

  cursor: (query={}) -> return new AjaxCursor(query, {model_type: @model_type, url: @url, request: @request})

  destroy: (query, callback) ->
    @request
      .del(@url)
      .query(query)
      .end (err, res) ->
        return callback(err) if err
        return callback(new Error "Ajax failed with status #{res.status} for #{'destroy'} with: #{util.inspect(res.body)}") unless res.ok
        callback()

module.exports = (model_type, cache) ->
  sync = new AjaxSync(model_type)

  model_type::sync = sync_fn = (method, model, options={}) -> # save for access by model extensions
    sync.initialize()

    return module.exports.apply(null, Array::slice.call(arguments, 1)) if method is 'createSync' # create a new sync
    return sync if method is 'sync'
    return sync.schema if method is 'schema'

    ###################################
    # Classic Backbone Sync
    ###################################
    if _.contains(['create', 'update', 'patch', 'delete', 'read'], method)
      throw new Error 'Missing url for model' unless url = options.url or _.result(model, 'url')

      request = sync.request # use request from the sync
      switch method
        when 'create'
          req = request.post(url).send(options.attrs or model.toJSON(options)).type('json')
        when 'update'
          req = request.put(url).send(options.attrs or model.toJSON(options)).type('json')
        when 'patch'
          req = request.patch(url).send(options.attrs or model.toJSON(options)).type('json')
        when 'delete'
          req = request.del(url)
        when 'read'
          req = request.get(url).query({$one: !model.models}).type('json')

      req.end (err, res) ->
        return options.error(err) if err
        return options.error(new Error "Ajax failed with status #{res.status} for #{method} with: #{util.inspect(res.body)}") unless res.ok
        options.success(JSONUtils.parse(res.body))
      return

    ###################################
    # Backbone ORM Sync
    ###################################
    if sync[method] then sync[method].apply(sync, Array::slice.call(arguments, 1)) else return undefined

  require('backbone-orm/lib/model_extensions')(model_type) # mixin extensions
  return if cache then require('backbone-orm/lib/cache_sync')(model_type, sync_fn) else sync_fn
