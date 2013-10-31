startsWith = (string, substring) -> string.lastIndexOf(substring, 0) is 0
LIBRARY_WRAPPERS = require './client/config_library_wrap'

module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    shell:
      library:
        options: {stdout: true, stderr: true}
        command: 'brunch build -c client/brunch_config.coffee'

    wrap:
      library:
        cwd: '_build/'
        expand: true
        src: ['backbone-http.js'],
        dest: '_build/',
        options: {wrapper: [LIBRARY_WRAPPERS.start, LIBRARY_WRAPPERS.end]}

      license:
        cwd: '_build/'
        expand: true
        src: ['backbone-http*.js'],
        dest: './',
        options: {wrapper: [LIBRARY_WRAPPERS.license, '']}

    uglify:
      library: {expand: true, cwd: '_build/', src: ['*.js'], dest: '_build/', ext: '-min.js'}

    clean:
      build: ['_build']

    zip:
      library:
        dest: 'client/backbone-http.zip'
        router: (filepath) ->
          return filepath.replace('node_modules/backbone-orm/', 'optional/') if startsWith(filepath, 'node_modules/backbone-orm/stream')
          return filepath.replace('node_modules/backbone-orm/', '') if startsWith(filepath, 'node_modules/backbone-orm/')
          filepath
        src: ['node_modules/backbone-orm/backbone-orm*.js', 'node_modules/backbone-orm/stream*.js', 'backbone-http*.js']

  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-wrap'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-zip'

  grunt.registerTask 'default', ['shell:library', 'wrap:library', 'uglify:library', 'wrap:license', 'zip:library', 'clean:build']
