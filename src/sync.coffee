###
  backbone-http.js 0.5.0
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js and Underscore.js.
###

_ = require 'underscore'
Backbone = require 'backbone'

bborm = require 'backbone-orm'
Schema = bborm.Schema
Utils = bborm.Utils
JSONUtils = bborm.JSONUtils
ModelCache = bborm.CacheSingletons.ModelCache

HTTPCursor = require './cursor'

module.exports = class HTTPSync

  constructor: (@model_type) ->
    @model_type.model_name = Utils.findOrGenerateModelName(@model_type)
    throw new Error("Missing url for model: #{@model_type}") unless @url = _.result(@model_type.prototype, 'url')
    @schema = new Schema(@model_type)
    @request = require 'superagent'

  initialize: (model) ->
    return if @is_initialized; @is_initialized = true
    @schema.initialize()

  ###################################
  # Backbone ORM - Class Extensions
  ###################################
  # @private
  resetSchema: (options, callback) ->
    @request
      .del(@url)
      .end (err, res) ->
        return callback(err) if err
        return callback(new Error "Ajax failed with status #{res.status} for #{'destroy'} with: #{_.keys(res.body)}") unless res.ok
        callback()

  cursor: (query={}) -> return new HTTPCursor(query, {model_type: @model_type, url: @url, request: @request})

  destroy: (query, callback) ->
    @request
      .del(@url)
      .query(query)
      .end (err, res) ->
        return callback(err) if err
        return callback(new Error "Ajax failed with status #{res.status} for #{'destroy'} with: #{_.keys(res.body)}") unless res.ok
        callback()

module.exports = (type) ->
  if Utils.isCollection(new type()) # collection
    model_type = Utils.configureCollectionModelType(type, module.exports)
    return type::sync = model_type::sync

  sync = new HTTPSync(type)
  type::sync = sync_fn = (method, model, options={}) -> # save for access by model extensions
    sync.initialize()

    return module.exports.apply(null, Array::slice.call(arguments, 1)) if method is 'createSync' # create a new sync
    return sync if method is 'sync'
    return sync.schema if method is 'schema'
    return true if method is 'isRemote'

    ###################################
    # Classic Backbone Sync
    ###################################
    if _.contains(['create', 'update', 'patch', 'delete', 'read'], method)
      throw new Error 'Missing url for model' unless url = options.url or _.result(model, 'url')

      request = sync.request # use request from the sync
      switch method
        when 'read'
          req = request.get(url).query({$one: !model.models}).type('json')
        when 'create'
          req = request.post(url).send(options.attrs or model.toJSON(options)).type('json')
        when 'update'
          req = request.put(url).send(options.attrs or model.toJSON(options)).type('json')
        when 'patch'
          req = request.patch(url).send(options.attrs or model.toJSON(options)).type('json')
        when 'delete'
          req = request.del(url)

      req.end (err, res) ->
        return options.error(err) if err
        return options.error(new Error "Ajax failed with status #{res.status} for #{method} with: #{_.keys(res.body)}") unless res.ok
        options.success(JSONUtils.parse(res.body))
      return

    ###################################
    # Backbone ORM Sync
    ###################################
    return if sync[method] then sync[method].apply(sync, Array::slice.call(arguments, 1)) else undefined

  Utils.configureModelType(type) # mixin extensions
  return ModelCache.configureSync(type, sync_fn)
