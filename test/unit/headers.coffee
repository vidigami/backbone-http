util = require 'util'
assert = require 'assert'
_ = require 'underscore'
Backbone = require 'backbone'
Queue = require 'backbone-orm/lib/queue'
Fabricator = require 'backbone-orm/test/fabricator'

module.exports = (options, callback) ->
  SYNC = require '../../lib/sync'
  BASE_COUNT = 5

  class Flat_HeadersObject extends Backbone.Model
    urlRoot: '/object_flats'
    sync: SYNC(Flat_HeadersObject, {headers: {Authorization: 'Bearer XYZ'}})

  class Flat_HeadersFunction extends Backbone.Model
    urlRoot: '/function_flats'
    sync: SYNC(Flat_HeadersFunction, {headers: (model, http_verb, options) -> {Authorization: "Bearer #{!!model}-#{http_verb}-#{!!options}"}})

  describe "Model.each (cache: #{options.cache}, query_cache: #{options.query_cache})", ->

    before (done) -> return done() unless options.before; options.before([Flat_HeadersObject, Flat_HeadersFunction], done)
    after (done) -> callback(); done()
    beforeEach (done) ->
      queue = new Queue(1)

      # reset caches
      queue.defer (callback) -> Flat_HeadersObject.resetSchema(callback)
      queue.defer (callback) -> Flat_HeadersFunction.resetSchema(callback)

      queue.defer (callback) -> Fabricator.create(Flat_HeadersObject, BASE_COUNT, {
        name: Fabricator.uniqueId('flat_')
        created_at: Fabricator.date
        updated_at: Fabricator.date
      }, callback)

      queue.defer (callback) -> Fabricator.create(Flat_HeadersFunction, BASE_COUNT, {
        name: Fabricator.uniqueId('flat_')
        created_at: Fabricator.date
        updated_at: Fabricator.date
      }, callback)

      queue.await done

    it 'callback for all models Flat_HeadersObject', (done) ->
      processed_count = 0

      queue = new Queue(1)
      queue.defer (callback) ->
        Flat_HeadersObject.eachC callback, (model, callback) ->
          assert.ok(!!model, 'model returned')
          processed_count++
          callback()

      queue.await (err) ->
        assert.ok(!err, "No errors: #{err}")
        assert.equal(BASE_COUNT, processed_count, "\nExpected: #{BASE_COUNT}\nActual: #{processed_count}")
        done()

    it 'callback for all models Flat_HeadersFunction', (done) ->
      processed_count = 0

      queue = new Queue(1)
      queue.defer (callback) ->
        Flat_HeadersFunction.eachC callback, (model, callback) ->
          assert.ok(!!model, 'model returned')
          processed_count++
          callback()

      queue.await (err) ->
        assert.ok(!err, "No errors: #{err}")
        assert.equal(BASE_COUNT, processed_count, "\nExpected: #{BASE_COUNT}\nActual: #{processed_count}")
        done()
