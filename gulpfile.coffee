path = require 'path'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
modules = require 'gulp-module-system'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
zip = require 'gulp-zip'

LIBRARY_WRAPPERS = require './client/config_library_wrap'

gulp.task 'build', ->
  gulp.src('src/**/*.coffee').pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('lib/'))

gulp.task 'watch', ['build'], ->
  gulp.watch './src/**/*.coffee', -> gulp.run 'build'

gulp.task 'build_client', ->
  gulp.src('src/**/*.coffee').pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(modules({type: 'local-shim', file_name: 'backbone-http.js', root: './src', umd: {symbol: 'BackboneHTTP', dependencies: ['backbone-orm', 'superagent'], bottom: true}}))
    .pipe(gulp.dest('./'))

gulp.task 'minify_client', ['build_client'], ->
  gulp.src('backbone-http.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./'))

gulp.task 'zip', ['minify_client'], ->
  gulp.src(['*.js', 'node_modules/backbone-orm/*.js'])
    .pipe(es.map (file, callback) -> file.path = file.path.replace('node_modules/backbone-orm/', 'backbone-orm/'); callback(null, file))
    .pipe(es.map (file, callback) -> file.path = file.path.replace('stream', 'optional/stream'); callback(null, file))
    .pipe(zip('backbone-http.zip'))
    .pipe(gulp.dest('client/'))

gulp.task 'release', ->
  gulp.run 'build', 'zip'
