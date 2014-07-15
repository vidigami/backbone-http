Queue = require 'queue-async'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
karma = require './karma/run'
mocha = require 'gulp-mocha'

module.exports = (callback) ->
  queue = new Queue(1)

  queue.defer (callback) -> (require '../test/lib/start_server')(callback)

  # run node tests
  queue.defer (callback) ->
    gutil.log 'Running Node.js tests'
    # ensure that globals for the target backend are loaded
    require 'node-jquery-xhr'; delete global.window; require('backbone').$ = global.$
    global.test_parameters = require '../test/parameters'
    gulp.src('node_modules/backbone-orm/test/spec/sync/**/*.tests.coffee')
      .pipe(mocha({}))
      .pipe es.writeArray (err, array) ->
        delete global.test_parameters
        # delete Backbone.$
        callback(err)

  # # run browser tests
  # queue.defer (callback) ->
  #   gutil.log 'Running Browser tests'
  #   karma(callback)

  queue.await callback
