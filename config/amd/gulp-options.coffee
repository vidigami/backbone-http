module.exports =
  karma: true,
  shims:
    underscore: {exports: '_'}
    backbone: {exports: 'Backbone', deps: ['underscore']}
    'backbone-orm': {exports: 'BackboneORM', deps: ['backbone', 'moment', 'stream']}
    'backbone-http': {exports: 'BackboneHTTP', deps: ['backbone-orm', 'superagent']}
    'option_sets': {exports: '__option_sets__', deps: ['backbone-http']}
    'parameters': {exports: '__test__parameters__', deps: ['backbone-http']}
  post_load: 'window._ = window.Backbone = window.moment = null; window.BackboneORM = backbone_orm; window.BackboneHTTP = backbone_http;'
  aliases: {'lodash': 'underscore'}

