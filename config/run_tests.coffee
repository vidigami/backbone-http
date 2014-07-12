Queue = require 'queue-async'
Wrench = require 'wrench'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
karma = require './karma/run'
mocha = require 'gulp-mocha'

module.exports = (callback) ->
  queue = new Queue(1)

  # install backbone-http
  queue.defer (callback) ->
    gulp.src(['./backbone-http.js', './package.json'])
      .pipe(gulp.dest('node_modules/backbone-http'))
      .on('end', callback)

  # run node tests
  # queue.defer (callback) ->
  #   gutil.log 'Running Node.js tests'
  #   gulp.src('test/suite.coffee')
  #     .pipe(mocha({}))
  #     .pipe(es.writeArray (err, array) -> callback(err))

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

  queue.await (err) ->
    Wrench.rmdirSyncRecursive('node_modules/backbone-http', true)
    callback(err)
