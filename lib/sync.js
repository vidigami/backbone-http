
/*
  backbone-http.js 0.5.6
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
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

HTTPSync = (function() {
  function HTTPSync(model_type, options) {
    this.model_type = model_type;
    if (options == null) {
      options = {};
    }
    !options.beforeSend || (this._beforeSend = options.beforeSend);
    this.model_type.model_name = Utils.findOrGenerateModelName(this.model_type);
    if (!(this.url = _.result(new this.model_type, 'url'))) {
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
    var req;
    req = this.request.del(this.url);
    this.beforeSend(req, null, options);
    return req.end(function(err, res) {
      if (err) {
        return callback(err);
      }
      if (!res.ok) {
        return callback(new Error("Ajax failed with status " + res.status + " for " + 'destroy' + " with: " + (Utils.inspect(res.body))));
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
      request: this.request,
      sync: this
    });
  };

  HTTPSync.prototype.destroy = function(query, callback) {
    var req;
    req = this.request.del(this.url).query(query);
    this.beforeSend(req, null);
    return req.end(function(err, res) {
      if (err) {
        return callback(err);
      }
      if (!res.ok) {
        return callback(new Error("Ajax failed with status " + res.status + " for " + 'destroy' + " with: " + (Utils.inspect(res.body))));
      }
      return callback();
    });
  };

  HTTPSync.prototype.beforeSend = function(req, model, options) {
    if (options == null) {
      options = {};
    }
    !options.beforeSend || options.beforeSend(req, model, options, this);
    return !this._beforeSend || this._beforeSend(req, model, options, this);
  };

  return HTTPSync;

})();

module.exports = function(type, sync_options) {
  var model_type, sync, sync_fn;
  if (Utils.isCollection(new type())) {
    model_type = Utils.configureCollectionModelType(type, module.exports, sync_options);
    return type.prototype.sync = model_type.prototype.sync;
  }
  sync = new HTTPSync(type, sync_options);
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
      sync.beforeSend(req, model, options);
      req.end(function(err, res) {
        if (err) {
          return options.error(err);
        }
        if (!res.ok) {
          return options.error(new Error("Ajax failed with status " + res.status + " for " + method + " with: " + (Utils.inspect(res.body))));
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
