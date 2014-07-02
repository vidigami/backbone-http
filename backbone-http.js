/*
  backbone-http.js 0.6.0
  Copyright (c) 2013-2014 Vidigami
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/vidigami/backbone-http
  Dependencies: Backbone.js, Underscore.js, and Moment.js.
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone-orm"), require("superagent"), require("underscore"), require("backbone"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone-orm", "superagent", "underscore", "backbone"], factory);
	else if(typeof exports === 'object')
		exports["kb"] = factory(require("backbone-orm"), require("superagent"), require("underscore"), require("backbone"));
	else
		root["kb"] = factory(root["BackboneORM"], root["superagent"], root["_"], root["Backbone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-http.js 0.6.0
	  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
	 */
	var BackboneORM, path, _i, _len, _ref;

	module.exports = {
	  sync: __webpack_require__(3),
	  modules: {
	    'backbone-orm': BackboneORM = __webpack_require__(1),
	    'superagent': __webpack_require__(2)
	  },
	  _: BackboneORM._,
	  Backbone: BackboneORM.Backbone
	};

	_ref = ['url', 'querystring', 'lru-cache', 'underscore', 'backbone', 'moment', 'inflection', 'stream'];
	for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	  path = _ref[_i];
	  module.exports.modules[path] = BackboneORM.modules[path];
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-http.js 0.6.0
	  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
	 */
	var Backbone, HTTPCursor, HTTPSync, JSONUtils, ModelCache, Schema, Utils, bborm, _;

	_ = __webpack_require__(4);

	Backbone = __webpack_require__(5);

	bborm = __webpack_require__(1);

	Schema = bborm.Schema;

	Utils = bborm.Utils;

	JSONUtils = bborm.JSONUtils;

	ModelCache = bborm.CacheSingletons.ModelCache;

	HTTPCursor = __webpack_require__(6);

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
	    this.request = __webpack_require__(2);
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-http.js 0.6.0
	  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
	 */
	var Cursor, HTTPCursor, JSONUtils, Utils, _,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	_ = __webpack_require__(4);

	Cursor = __webpack_require__(1).Cursor;

	JSONUtils = __webpack_require__(1).JSONUtils;

	Utils = __webpack_require__(1).Utils;

	module.exports = HTTPCursor = (function(_super) {
	  __extends(HTTPCursor, _super);

	  function HTTPCursor() {
	    return HTTPCursor.__super__.constructor.apply(this, arguments);
	  }

	  HTTPCursor.prototype.toJSON = function(callback) {
	    var query, req;
	    if (this.hasCursorQuery('$zero')) {
	      return callback(null, this.hasCursorQuery('$one') ? null : []);
	    }
	    req = this.request.get(this.url).query(query = JSONUtils.toQuery(_.extend(_.clone(this._find), this._cursor))).type('json');
	    this.sync.beforeSend(req, null);
	    return req.end((function(_this) {
	      return function(err, res) {
	        var result;
	        if (err) {
	          return callback(err);
	        }
	        if (query.$one && (res.status === 404)) {
	          return callback(null, null);
	        }
	        if (!res.ok) {
	          return callback(new Error("Ajax failed with status " + res.status + " with: " + (Utils.inspect(res.body))));
	        }
	        result = JSONUtils.parse(res.body);
	        return callback(null, _this.hasCursorQuery('$count') || _this.hasCursorQuery('$exists') ? result.result : result);
	      };
	    })(this));
	  };

	  return HTTPCursor;

	})(Cursor);


/***/ }
/******/ ])
})
