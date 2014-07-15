BackboneHTTP = window?.BackboneHTTP; try BackboneHTTP or= require?('backbone-http') catch; try BackboneHTTP or= require?('../backbone-http')

exports =
  database_url: 'http://localhost:5555'
  sync: BackboneHTTP.sync

(if window? then window else global).__test__parameters = exports; module?.exports = exports
