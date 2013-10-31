fs = require 'fs'
path = require 'path'

module.exports =

  license: """
    /*
      backbone-http.js 0.5.0
      Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
      License: MIT (http://www.opensource.org/licenses/mit-license.php)
      Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
    */
    """

  start: fs.readFileSync(path.join(__dirname, '../node_modules/backbone-orm/client/require.js'), {encoding: 'utf8'})

  end: """
    if (typeof exports == 'object') {
      module.exports = require('backbone-http/lib/index');
    } else if (typeof define == 'function' && define.amd) {
      define('backbone-http', ['backbone-orm', 'superagent'], function(){ return require('backbone-http/lib/index'); });
    } else {
      var Backbone = this.Backbone;
      if (!Backbone && (typeof window.require == 'function')) {
        try { Backbone = window.require('backbone'); } catch (_error) { Backbone = this.Backbone = {}; }
      }
      Backbone.HTTP = require('backbone-http/lib/index');
    }
    }).call(this);
    """
