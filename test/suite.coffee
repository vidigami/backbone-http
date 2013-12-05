_ = require 'underscore'
Queue = require 'backbone-orm/lib/queue'

option_sets = require('backbone-orm/test/option_sets')
option_sets = option_sets.slice(0, 1)

test_parameters =
  sync: require '../lib/sync'
  before: require './lib/build_mocks'

test_queue = new Queue(1)
for options in option_sets
  do (options) -> test_queue.defer (callback) ->
    console.log "\nBackbone HTTP: Running tests with options:\n", options
    _.extend(options, test_parameters)

    queue = new Queue(1)
    queue.defer (callback) -> require('backbone-orm/test/generators/all')(options, callback)
    queue.defer (callback) -> require('backbone-rest/test/generators/all')(options, callback)
    queue.defer (callback) -> require('./unit/before_send')(options, callback)
    queue.await callback
test_queue.await (err) -> console.log "Backbone REST: Completed tests"
