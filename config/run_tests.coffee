Queue = require 'queue-async'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
karma = require './karma/run'
mocha = require 'gulp-mocha'

module.exports = (callback) ->
  queue = new Queue(1)

  # run node tests
  queue.defer (callback) ->
    gutil.log 'Running Node.js tests (new)'
    # ensure that globals for the target backend are loaded
    global.test_parameters = require '../test/parameters'
    gulp.src('node_modules/backbone-orm/test/spec/**/*.coffee')
      .pipe(mocha({}))
      .pipe es.writeArray (err, array) ->
        delete global.test_parameters
        callback(err)


  # run browser tests
  queue.defer (callback) ->
    gutil.log 'Running Browser tests'
    karma(callback)

  queue.await callback
