path = require 'path'
Async = require 'async'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
webpack = require 'gulp-webpack-config'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'
zip = require 'gulp-zip'
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

gulp.task 'build', buildLibraries = (callback) ->
  gulp.src('config/builds/library/**/*.webpack.config.coffee', {read: false, buffer: false})
    .pipe(webpack())
    .pipe(header(HEADER, {pkg: require './package.json'}))
    .pipe(gulp.dest((file) -> file.base))
    .on('end', callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'watch', ['build'], (callback) ->
  gulp.watch './src/**/*.coffee', (callback) -> buildLibraries(callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'minify', ['build'], (callback) ->
  gulp.src(['*.js', '!*.min.js', '!_temp/**/*.js', '!node_modules/'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header(HEADER, {pkg: require './package.json'}))
    .pipe(gulp.dest((file) -> file.base))
    .on('end', callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'start-test-server', (callback) ->
  console.log 'Starting server'
  (require './test/lib/test_server').start (callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-node', ['build', 'start-test-server'], testNode = (callback) ->
  (require './test/lib/test_server').retain()

  gutil.log 'Running Node.js tests'
  require './test/lib/node_jquery_xhr' # ensure that globals for the target backend are loaded
  global.test_parameters = require './test/parameters'
  gulp.src(['test/spec/**/*.tests.coffee', 'node_modules/backbone-orm/test/spec/sync/**/*.tests.coffee'])
    .pipe(mocha({}))
    .pipe es.writeArray (err, array) ->
      delete global.test_parameters
      (require './test/lib/test_server').release(err); callback(err)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-browsers', ['build', 'start-test-server'], testBrowsers = (callback) ->
  (require './test/lib/test_server').retain()

  gutil.log 'Running Browser tests'
  (require './config/karma/run') (err) ->
    (require './test/lib/test_server').release(err); callback(err)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test', ['minify', 'start-test-server'], (callback) ->
  (require './test/lib/test_server').retain()

  Async.series [testNode, testBrowsers], (err) -> (require './test/lib/test_server').release(err)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-quick', ['test'], testNode
gulp.task 'test-node-quick', ['build', 'start-test-server'], testNode
gulp.task 'test-browsers-quick', ['build', 'start-test-server'], testBrowsers

gulp.task 'zip', ['minify'], (callback) ->
  gulp.src(['*.js', 'node_modules/backbone-orm/*.js'])
    .pipe(es.map (file, callback) -> file.path = file.path.replace('node_modules/backbone-orm/', 'backbone-orm/'); callback(null, file))
    .pipe(es.map (file, callback) -> file.path = file.path.replace('stream', 'optional/stream'); callback(null, file))
    .pipe(zip('backbone-http.zip'))
    .pipe(gulp.dest('./'))
    .on('end', callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'release', ['build', 'zip'], ->
