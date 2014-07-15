Queue = require 'queue-async'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
mocha = require 'gulp-mocha'

gulp.task 'test-node', ['minify'], testNode = (callback) ->
  gutil.log 'Running Node.js tests'
  # ensure that globals for the target backend are loaded
  require '../test/node_jquery_xhr'
  global.test_parameters = require '../test/parameters'
  gulp.src('node_modules/backbone-orm/test/spec/sync/**/*.coffee')
    .pipe(mocha({}))
    .pipe es.writeArray (err, array) ->
      delete global.test_parameters
      callback(err)

gulp.task 'test-browsers', ['minify', 'start-test-server'], testBrowsers = (callback) ->
  gutil.log 'Running Browser tests'
  (require './karma/run')(callback)

gulp.task 'test-browsers-clean', ['minify', 'start-test-server'], (callback) ->
  testBrowsers (err) -> (require '../test/lib/start_server').server?.close(); callback(err)

gulp.task 'test-browsers-after-node', ['minify', 'start-test-server', 'test-node'], testBrowsers

module.exports = (callback) ->
  queue = new Queue(1)
  queue.defer testNode
  server_ready = false
  queue.defer (callback) -> (require '../test/lib/start_server').onReady (err) -> server_ready = true; callback(err)
  queue.defer testBrowsers
  queue.await (err) ->
    (require '../test/lib/start_server').close() if server_ready
    callback(err)
