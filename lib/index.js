
/*
  backbone-http.js 0.5.4
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
 */
var bborm, path, _i, _len, _ref;

if ((typeof window !== "undefined" && window !== null) && require.shim) {
  require.shim([
    {
      symbol: '_',
      path: 'lodash',
      alias: 'underscore',
      optional: true
    }, {
      symbol: '_',
      path: 'underscore'
    }, {
      symbol: 'Backbone',
      path: 'backbone'
    }, {
      symbol: 'moment',
      path: 'moment'
    }, {
      symbol: 'inflection',
      path: 'inflection'
    }, {
      symbol: 'stream',
      path: 'stream',
      optional: true
    }, {
      symbol: 'BackboneORM',
      path: 'backbone-orm'
    }, {
      symbol: 'superagent',
      path: 'superagent'
    }
  ]);
}

module.exports = {
  sync: require('./sync'),
  modules: {
    'backbone-orm': bborm = require('backbone-orm'),
    'superagent': require('superagent')
  }
};

_ref = ['url', 'querystring', 'lru-cache', 'underscore', 'backbone', 'moment', 'inflection', 'stream'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  path = _ref[_i];
  module.exports.modules[path] = bborm.modules[path];
}
