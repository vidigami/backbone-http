util = require 'util'
assert = require 'assert'
_ = require 'underscore'
Backbone = require 'backbone'

BackboneORM = require 'backbone-orm'
Queue = BackboneORM.Queue
Fabricator = BackboneORM.Fabricator

BackboneHTTP = require 'backbone-http'

module.exports = (options, callback) ->
  SYNC = BackboneHTTP.sync
  BASE_COUNT = 5
  methods = []

  class Flat extends Backbone.Model
    urlRoot: '/function_flats'
    sync: SYNC(Flat, {beforeSend: (req, model, options, sync) -> methods.push(req.method)})

  describe "Model.each (cache: #{options.cache}, query_cache: #{options.query_cache})", ->

    before (done) -> return done() unless options.before; options.before([Flat], done)
    after (done) -> callback(); done()
    beforeEach (done) ->
      queue = new Queue(1)

      # reset caches
      queue.defer (callback) -> Flat.resetSchema(callback)

      queue.defer (callback) -> Fabricator.create(Flat, BASE_COUNT, {
        name: Fabricator.uniqueId('flat_')
        created_at: Fabricator.date
        updated_at: Fabricator.date
      }, callback)

      queue.await (err) -> methods = []; done(err)

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
        assert.deepEqual(expected = ['get'], methods, "\nExpected: #{expected}\nActual: #{methods}")
        done()
