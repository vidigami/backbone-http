assert = assert or require?('chai').assert

BackboneORM = require 'backbone-orm'
{_, Backbone, Queue, Utils, Fabricator} = BackboneORM

option_sets = window?.__test__option_sets or require?('../../node_modules/backbone-orm/test/option_sets')
parameters = __test__parameters if __test__parameters?
_.each option_sets, exports = (options) ->
  options = _.extend({}, options, parameters) if parameters

  DATABASE_URL = options.database_url or ''
  SYNC = options.sync
  BASE_COUNT = 5
  methods = []

  class Flat extends Backbone.Model
    urlRoot: "#{DATABASE_URL}/flats"
    sync: SYNC(Flat, {beforeSend: (context, xhr) -> methods.push(xhr.type)})

  describe "Model.each (cache: #{options.cache}, query_cache: #{options.query_cache})", ->

    after (callback) ->
      queue = new Queue()
      queue.defer (callback) -> BackboneORM.model_cache.reset(callback)
      queue.defer (callback) -> Utils.resetSchemas [Flat], callback
      queue.await callback

    beforeEach (callback) ->
      MODELS = {}

      queue = new Queue(1)
      queue.defer (callback) -> BackboneORM.configure({model_cache: {enabled: !!options.cache, max: 100}}, callback)
      queue.defer (callback) -> Utils.resetSchemas [Flat], callback
      queue.defer (callback) -> Fabricator.create(Flat, BASE_COUNT, {
        name: Fabricator.uniqueId('flat_')
        created_at: Fabricator.date
        updated_at: Fabricator.date
      }, callback)

      queue.await (err) -> methods = []; callback(err)

    it 'callback for all models Flat', (done) ->
      processed_count = 0

      queue = new Queue(1)
      queue.defer (callback) ->
        Flat.eachC callback, (model, callback) ->
          assert.ok(!!model, 'model returned')
          processed_count++
          callback()

      queue.await (err) ->
        assert.ok(!err, "No errors: #{err}")
        assert.equal(BASE_COUNT, processed_count, "\nExpected: #{BASE_COUNT}\nActual: #{processed_count}")
        assert.deepEqual(expected = ['GET'], methods, "\nExpected: #{expected}\nActual: #{methods}")
        done()
