startsWith = (string, substring) -> string.lastIndexOf(substring, 0) is 0

exports.config =
  sourceMaps: false
  paths:
    public: './_build'
    watched: ['src', 'node_modules/backbone-orm/src']
  modules:
    nameCleaner: (path) ->
      console.log path
      path.replace(/^src\//, 'backbone-http/lib/')
  files:
    javascripts:
      joinTo:
        'backbone-http.js': /^src/
      order:
        before: []
