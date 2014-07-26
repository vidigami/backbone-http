path = require 'path'
_ = require 'underscore'
Async = require 'async'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
webpack = require 'gulp-webpack-config'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'
mocha = require 'gulp-mocha'

HEADER = """
/*
  <%= file.path.split('/').splice(-1)[0].replace('.min', '') %> <%= pkg.version %>
  Copyright (c) 2013-#{(new Date()).getFullYear()} Vidigami
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/vidigami/backbone-http
  Dependencies: Backbone.js, Underscore.js, and BackboneORM.
*/\n
"""

gulp.task 'build', buildLibraries = ->
  return gulp.src('config/builds/library/**/*.webpack.config.coffee', {read: false, buffer: false})
    .pipe(webpack())
    .pipe(header(HEADER, {pkg: require './package.json'}))
    .pipe(gulp.dest('.'))

gulp.task 'watch', ['build'], ->
  return gulp.watch './src/**/*.coffee', -> buildLibraries()

gulp.task 'minify', ['build'], ->
  return gulp.src(['*.js', '!*.min.js', '!_temp/**/*.js', '!node_modules/'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header(HEADER, {pkg: require './package.json'}))
    .pipe(gulp.dest((file) -> file.base))

gulp.task 'start-test-server', (callback) ->
  console.log 'Starting server'
  (require './test/lib/test_server').start (callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

testNodeFn = (options={}) -> (callback) ->
  (require './test/lib/test_server').retain()

  gutil.log "Running Node.js tests #{if options.quick then '(quick)' else ''}"
  require './test/lib/node_jquery_xhr' # ensure that globals for the target backend are loaded
  global.test_parameters = require './test/parameters'
  mocha_options = if options.quick then {grep: '@quick'} else {}
  gulp.src("{node_modules/backbone-#{if options.quick then 'orm' else '{orm,rest}'}/,}test/{issues,spec/sync}/**/*.tests.coffee")
    .pipe(mocha(_.extend({reporter: 'dot'}, mocha_options)))
    .pipe es.writeArray (err, array) ->
      delete global.test_parameters
      (require './test/lib/test_server').release(err); callback(err)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

testBrowsersFn = (options={}) -> (callback) ->
  (require './test/lib/test_server').retain()

  gutil.log "Running Browser tests #{if options.quick then '(quick)' else ''}"
  (require './config/karma/run') options, (err) ->
    (require './test/lib/test_server').release(err); callback(err)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-node', ['build', 'start-test-server'], testNodeFn()
gulp.task 'test-browsers', ['build', 'start-test-server'], testBrowsersFn()

gulp.task 'test', ['minify', 'start-test-server'], (callback) ->
  (require './test/lib/test_server').retain()

  Async.series [testNodeFn(), testBrowsersFn()], (err) -> (require './test/lib/test_server').release(err); callback(err)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-quick', ['start-test-server'], (callback) ->
  (require './test/lib/test_server').retain()
  Async.series [testNodeFn({quick: true}), testBrowsersFn({quick: true})], (err) -> (require './test/lib/test_server').release(err); callback(err)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-node-quick', ['build', 'start-test-server'], testNodeFn({quick: true})
gulp.task 'test-browsers-quick', ['build', 'start-test-server'], testBrowsersFn({quick: true})
