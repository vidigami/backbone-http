path = require 'path'

module.exports =
  underscore:
    output: './_temp/browserify/backbone-http-underscore.tests.js'
    files: ['test/parameters.coffee', './node_modules/backbone-orm/test/option_sets.coffee', './node_modules/backbone-orm/test/spec/sync/**/*.tests.coffee']
    options:
      ignore: ['../../../option_sets', '../../../backbone-orm', '../../../../backbone-orm']
      shim:
        backbone: {path: path.resolve(path.join('.', path.relative('.', require.resolve('backbone')))), exports: 'Backbone', depends: {jquery: '$'}}
        'backbone-http': {path: './backbone-http.js', exports: 'BackboneHTTP', depends: {jquery: '$', underscore: '_', backbone: 'Backbone', 'backbone-orm': 'BackboneORM', stream: 'stream'}}

  lodash:
    output: './_temp/browserify/backbone-http-lodash.tests.js'
    files: ['test/parameters.coffee', './node_modules/backbone-orm/test/option_sets.coffee', './node_modules/backbone-orm/test/spec/sync/**/*.tests.coffee']
    options:
      ignore: ['../../../option_sets', '../../../backbone-orm', '../../../../backbone-orm']
      shim:
        jquery: {path: path.resolve(path.join('.', path.relative('.', require.resolve('jquery')))), exports: '$'}
        underscore: {path: path.resolve(path.join('.', path.relative('.', require.resolve('lodash')))), exports: '_'}
        backbone: {path: path.resolve(path.join('.', path.relative('.', require.resolve('backbone')))), exports: 'Backbone', depends: {jquery: '$'}}
        'backbone-http': {path: './backbone-http.js', exports: 'BackboneHTTP', depends: {underscore: '_', backbone: 'Backbone', 'backbone-orm': 'BackboneORM', stream: 'stream'}}
