BackboneHTTP = window?.BackboneHTTP or require?('backbone-orm')

exports =
  database_url: 'http://localhost:5555'
  sync: BackboneHTTP.sync

(if window? then window else if global? then global).__test__parameters = exports; module?.exports = exports
