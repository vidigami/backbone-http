assert = assert or require?('chai').assert

BackboneORM = require 'backbone-orm'
{_, Backbone, Queue, Utils, Fabricator} = BackboneORM

_.each BackboneORM.TestUtils.optionSets(), exports = (options) ->
  options = _.extend({}, options, __test__parameters) if __test__parameters?

  DATABASE_URL = options.database_url or ''
  SYNC = options.sync
  BASE_COUNT = 5

  describe "beforeSend #{options.$parameter_tags or ''}#{options.$tags}", ->
    Flat = methods = []
    before ->
      BackboneORM.configure {model_cache: {enabled: !!options.cache, max: 100}}

      class Flat extends Backbone.Model
        urlRoot: "#{DATABASE_URL}/flats"
        sync: SYNC(Flat, {beforeSend: (context, xhr) -> methods.push(xhr.type)})

    after (callback) -> Utils.resetSchemas [Flat], callback
    beforeEach (callback) ->
      MODELS = {}

      Utils.resetSchemas [Flat], (err) ->
        return callback(err) if err

        Fabricator.create Flat, BASE_COUNT, {
          name: Fabricator.uniqueId('flat_')
          created_at: Fabricator.date
          updated_at: Fabricator.date
        }, (err) -> methods = []; callback(err)

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
