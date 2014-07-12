BackboneHTTP = window?.BackboneHTTP or require?('backbone-orm')

exports =
  sync: BackboneHTTP.sync
  $parameter_tags: '@http_sync '

(if window? then window else if global? then global).__test__parameters = exports; module?.exports = exports
