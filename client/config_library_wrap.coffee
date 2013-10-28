module.exports =

  license: """
    /*
      backbone-http.js 0.0.1
      Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
      License: MIT (http://www.opensource.org/licenses/mit-license.php)
      Dependencies: Backbone.js and Underscore.js.
    */
    """

  start: """
    (function() {
    """

  end: """
    if (typeof exports == 'object') {
      module.exports = require('bbhttp/index');
    } else if (typeof define == 'function' && define.amd) {
      define('bbhttp', ['bborm', 'superagent'], function(){ return require('bbhttp/index'); });
    } else {
      this['bbhttp'] = require('bbhttp/index');
    }
    }).call(this);
    """
