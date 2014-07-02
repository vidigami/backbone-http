_ = require 'underscore'
Queue = require 'queue-async'

option_sets = require 'backbone-orm/test/option_sets'
# option_sets = option_sets.slice(0, 1)

BackboneHTTP = window?.BackboneHTTP or require 'backbone-http'

test_parameters =
  sync: BackboneHTTP.sync
  before: require './lib/build_mocks'

test_queue = new Queue(1)
for options in option_sets
  do (options) -> test_queue.defer (callback) ->
    console.log "\nBackbone HTTP: Running tests with options:\n", options
    _.extend(options, test_parameters)

    queue = new Queue(1)
    queue.defer (callback) -> require('./unit/backbone_orm')(options, callback)
    queue.defer (callback) -> require('./unit/backbone_rest')(options, callback)
    queue.defer (callback) -> require('./unit/before_send')(options, callback)
    queue.await callback
test_queue.await (err) -> console.log "Backbone REST: Completed tests"
