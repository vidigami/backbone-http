###
  backbone-http.js 0.6.0
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
###

_ = require 'underscore'
Backbone = require 'backbone'
backboneSync = Backbone.sync

bborm = require 'backbone-orm'
Schema = bborm.Schema
Utils = bborm.Utils
JSONUtils = bborm.JSONUtils
ModelCache = bborm.CacheSingletons.ModelCache

HTTPCursor = require './cursor'
URL = require 'url'

class HTTPSync

  constructor: (@model_type, options={}) ->
    not options.beforeSend or @_beforeSend = options.beforeSend
    @model_type.model_name = Utils.findOrGenerateModelName(@model_type)
    throw new Error("Missing url for model: #{@model_type}") unless @url = _.result(new @model_type, 'url')
    @schema = new Schema(@model_type)
    @event_emitter = _.extend({}, Backbone.Events)

  initialize: (model) ->
    return if @is_initialized; @is_initialized = true
    @schema.initialize()

  ###################################
  # Backbone ORM - Class Extensions
  ###################################
  # @private
  resetSchema: (options, callback) -> @http('delete', null, {}, callback)
  cursor: (query={}) -> return new HTTPCursor(query, {model_type: @model_type, sync: @})
  destroy: (query, callback) ->
    [query, callback] = [{}, query] if arguments.length is 1
    @http('delete', null, {query: query}, callback)

  http: (method, model, options, callback) ->
    url = if model then _.result(model, 'url') else @url
    if options.query and _.size(options.query)
      url_parts = URL.parse(url, true); _.extend(url_parts.query, JSONUtils.toQuery(options.query)); url = URL.format(url_parts)

    backboneSync method, model or @event_emitter, _.extend({url: url, beforeSend: @beforeSend}, options, {
      success: (res) -> callback(null, JSONUtils.parse(res))
      error: (res) -> return callback(_.extend(new Error("Ajax failed with status #{res.status} for #{method}"), {status: res.status}))
    })

module.exports = (type, sync_options) ->
  if Utils.isCollection(new type()) # collection
    model_type = Utils.configureCollectionModelType(type, module.exports, sync_options)
    return type::sync = model_type::sync

  sync = new HTTPSync(type, sync_options)
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

      options = _.extend({$one: !model.models}, options) if method is 'read'
      sync.http method, model, _.omit(options, 'error', 'success'), (err, res) =>
        if err then options.error(err) else options.success(res)
      return

    ###################################
    # Backbone ORM Sync
    ###################################
    return if sync[method] then sync[method].apply(sync, Array::slice.call(arguments, 1)) else undefined

  Utils.configureModelType(type) # mixin extensions
  return ModelCache.configureSync(type, sync_fn)
