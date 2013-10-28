/*
  backbone-http.js 0.0.1
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js and Underscore.js.
*/
(function() {
var globals = {};

/* local-only brunch-like require (based on https://github.com/brunch/commonjs-require-definition) */
(function() {
  'use strict';

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    var _require = function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
    _require.register = require.register;
    return _require;
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
}).call(this);
var require = globals.require;

require.register("backbone-http/lib/client_utils", function(exports, require, module) {
/*
  backbone-orm.js 0.0.1
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js and Underscore.js.
*/

var ClientUtils;

module.exports = ClientUtils = (function() {
  function ClientUtils() {}

  ClientUtils.loadDependency = function(item) {
    var dep, err, key, _i, _len, _ref;
    if (typeof window === "undefined" || window === null) {
      return;
    }
    try {
      if (require(item.path)) {
        return;
      }
    } catch (_error) {
      err = _error;
    }
    try {
      dep = typeof window.require === "function" ? window.require(item.path) : void 0;
    } catch (_error) {
      err = _error;
    }
    if (!dep) {
      dep = window;
      _ref = item.symbol.split('.');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (!(dep = dep[key])) {
          break;
        }
      }
    }
    if (!dep) {
      if (item.optional) {
        return;
      }
      throw new Error("Missing dependency: " + item.path);
    }
    require.register(item.path, (function(exports, require, module) {
      return module.exports = dep;
    }));
    if (item.alias) {
      return require.register(item.alias, (function(exports, require, module) {
        return module.exports = dep;
      }));
    }
  };

  ClientUtils.loadDependencies = function(info) {
    var item, _i, _len;
    for (_i = 0, _len = info.length; _i < _len; _i++) {
      item = info[_i];
      this.loadDependency(item);
    }
  };

  return ClientUtils;

})();

});

;require.register("backbone-http/lib/cursor", function(exports, require, module) {
/*
  backbone-http.js 0.0.1
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js and Underscore.js.
*/

var Cursor, HTTPCursor, JSONUtils, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Cursor = require('backbone-orm').Cursor;

JSONUtils = require('backbone-orm').JSONUtils;

module.exports = HTTPCursor = (function(_super) {
  __extends(HTTPCursor, _super);

  function HTTPCursor() {
    _ref = HTTPCursor.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HTTPCursor.prototype.toJSON = function(callback) {
    var query,
      _this = this;
    if (this.hasCursorQuery('$zero')) {
      return callback(null, this.hasCursorQuery('$one') ? null : []);
    }
    query = JSONUtils.toQuery(_.extend(_.extend({}, this._find), this._cursor));
    return this.request.get(this.url).query(query).type('json').end(function(err, res) {
      var result;
      if (err) {
        return callback(err);
      }
      if (query.$one && (res.status === 404)) {
        return callback(null, null);
      }
      if (!res.ok) {
        return callback(new Error("Ajax failed with status " + res.status + " with: " + (_.keys(res.body))));
      }
      result = JSONUtils.parse(res.body);
      return callback(null, _this.hasCursorQuery('$count') || _this.hasCursorQuery('$exists') ? result.result : result);
    });
  };

  return HTTPCursor;

})(Cursor);

});

;require.register("backbone-http/lib/index", function(exports, require, module) {
/*
  backbone-http.js 0.0.1
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js and Underscore.js.
*/

require('./client_utils').loadDependencies([
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
    symbol: 'superagent',
    path: 'superagent'
  }, {
    symbol: 'Backbone.ORM',
    path: 'backbone-orm'
  }
]);

module.exports = {
  sync: require('./sync')
};

});

;require.register("backbone-http/lib/sync", function(exports, require, module) {
/*
  backbone-http.js 0.0.1
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js and Underscore.js.
*/

var Backbone, HTTPCursor, HTTPSync, JSONUtils, ModelCache, Schema, Utils, bborm, _;

_ = require('underscore');

Backbone = require('backbone');

bborm = require('backbone-orm');

Schema = bborm.Schema;

Utils = bborm.Utils;

JSONUtils = bborm.JSONUtils;

ModelCache = bborm.CacheSingletons.ModelCache;

HTTPCursor = require('./cursor');

module.exports = HTTPSync = (function() {
  function HTTPSync(model_type) {
    this.model_type = model_type;
    this.model_type.model_name = Utils.findOrGenerateModelName(this.model_type);
    if (!(this.url = _.result(this.model_type.prototype, 'url'))) {
      throw new Error("Missing url for model: " + this.model_type);
    }
    this.schema = new Schema(this.model_type);
    this.request = require('superagent');
  }

  HTTPSync.prototype.initialize = function(model) {
    if (this.is_initialized) {
      return;
    }
    this.is_initialized = true;
    return this.schema.initialize();
  };

  HTTPSync.prototype.resetSchema = function(options, callback) {
    return this.request.del(this.url).end(function(err, res) {
      if (err) {
        return callback(err);
      }
      if (!res.ok) {
        return callback(new Error("Ajax failed with status " + res.status + " for " + 'destroy' + " with: " + (_.keys(res.body))));
      }
      return callback();
    });
  };

  HTTPSync.prototype.cursor = function(query) {
    if (query == null) {
      query = {};
    }
    return new HTTPCursor(query, {
      model_type: this.model_type,
      url: this.url,
      request: this.request
    });
  };

  HTTPSync.prototype.destroy = function(query, callback) {
    return this.request.del(this.url).query(query).end(function(err, res) {
      if (err) {
        return callback(err);
      }
      if (!res.ok) {
        return callback(new Error("Ajax failed with status " + res.status + " for " + 'destroy' + " with: " + (_.keys(res.body))));
      }
      return callback();
    });
  };

  return HTTPSync;

})();

module.exports = function(type) {
  var model_type, sync, sync_fn;
  if (Utils.isCollection(new type())) {
    model_type = Utils.configureCollectionModelType(type, module.exports);
    return type.prototype.sync = model_type.prototype.sync;
  }
  sync = new HTTPSync(type);
  type.prototype.sync = sync_fn = function(method, model, options) {
    var req, request, url;
    if (options == null) {
      options = {};
    }
    sync.initialize();
    if (method === 'createSync') {
      return module.exports.apply(null, Array.prototype.slice.call(arguments, 1));
    }
    if (method === 'sync') {
      return sync;
    }
    if (method === 'schema') {
      return sync.schema;
    }
    if (method === 'isRemote') {
      return true;
    }
    if (_.contains(['create', 'update', 'patch', 'delete', 'read'], method)) {
      if (!(url = options.url || _.result(model, 'url'))) {
        throw new Error('Missing url for model');
      }
      request = sync.request;
      switch (method) {
        case 'read':
          req = request.get(url).query({
            $one: !model.models
          }).type('json');
          break;
        case 'create':
          req = request.post(url).send(options.attrs || model.toJSON(options)).type('json');
          break;
        case 'update':
          req = request.put(url).send(options.attrs || model.toJSON(options)).type('json');
          break;
        case 'patch':
          req = request.patch(url).send(options.attrs || model.toJSON(options)).type('json');
          break;
        case 'delete':
          req = request.del(url);
      }
      req.end(function(err, res) {
        if (err) {
          return options.error(err);
        }
        if (!res.ok) {
          return options.error(new Error("Ajax failed with status " + res.status + " for " + method + " with: " + (_.keys(res.body))));
        }
        return options.success(JSONUtils.parse(res.body));
      });
      return;
    }
    if (sync[method]) {
      return sync[method].apply(sync, Array.prototype.slice.call(arguments, 1));
    } else {
      return void 0;
    }
  };
  Utils.configureModelType(type);
  return ModelCache.configureSync(type, sync_fn);
};

});

;
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
