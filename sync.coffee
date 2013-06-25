util = require 'util'
_ = require 'underscore'
Backbone = require 'backbone'
inflection = require 'inflection'

AjaxCursor = require './lib/ajax_cursor'
Schema = require 'backbone-orm/lib/schema'
Utils = require 'backbone-orm/lib/utils'

module.exports = class AjaxSync

  constructor: (@model_type) ->
    throw new Error("Missing url for model") unless @url = _.result(@model_type.prototype, 'url')
    url_parts = Utils.parseUrl(@url)

    # publish methods and sync on model
    @model_type.model_name = url_parts.model_name
    @model_type._sync = @
    @model_type._schema = new Schema(@model_type)

    @request = @superagent or require 'superagent'

    ###################################
    # TEST: override request
    ###################################
    if process?.env.NODE_ENV is 'test'
      express = require 'express'
      RestController = require 'backbone-rest'

      class TestModel extends Backbone.Model
        urlRoot: '/ajax_tests'
        sync: require('backbone-orm/memory_sync')(TestModel)

      app = express(); app.use(express.bodyParser())
      controller = new RestController(app, {model_type: TestModel, route: @url}) # implicit knowledge of backbone-rest tests

      @request = require('supertest')(app)

  initialize: (model) ->
    return if @is_initialized; @is_initialized = true
    @model_type._schema.initialize()

  ###################################
  # Backbone ORM - Class Extensions
  ###################################
  cursor: (query={}) -> return new AjaxCursor(query, {model_type: @model_type, url: @url, request: @request})

  destroy: (query, callback) ->
    @request
      .del(@url)
      .query(query)
      .end (err, res) ->
        return callback(err) if err
        return callback(new Error "Ajax failed with status #{res.status} for #{'destroy'} with: #{util.inspect(res.body)}") unless res.ok
        callback(null, res.body)

  schema: (key) -> @model_type._schema
  relation: (key) -> @model_type._schema.relation(key)


module.exports = (model_type, cache) ->
  sync = new AjaxSync(model_type)

  sync_fn = (method, model, options={}) ->
    sync['initialize']()

    return module.exports.apply(null, Array::slice.call(arguments, 1)) if method is 'createSync' # create a new sync
    return sync if method is 'sync'

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
        options.success(res.body)
      return

    ###################################
    # Backbone ORM Sync
    ###################################
    sync[method].apply(sync, Array::slice.call(arguments, 1))

  require('backbone-orm/lib/model_extensions')(model_type, sync_fn) # mixin extensions
  return if cache then require('backbone-orm/lib/cache_sync')(model_type, sync_fn) else sync_fn