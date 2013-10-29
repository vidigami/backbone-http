startsWith = (string, substring) -> string.lastIndexOf(substring, 0) is 0

exports.config =
  sourceMaps: false
  paths:
    public: './_build'
    watched: ['src']
  modules:
    definition: false
    nameCleaner: (path) -> path.replace(/^src\//, 'backbone-http/lib/')
  files:
    javascripts:
      joinTo:
        'backbone-http.js': /^src/
      order:
        before: []
