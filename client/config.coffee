startsWith = (string, substring) -> string.lastIndexOf(substring, 0) is 0

exports.config =
  sourceMaps: false
  paths:
    public: './_build'
    watched: ['src']
  modules:
    nameCleaner: (path) -> path.replace(/^src\//, 'bbhttp/')
  files:
    javascripts:
      joinTo:
        'backbone-http.js': /^src/
      order:
        before: []
