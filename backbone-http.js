/*
  backbone-http.js 0.6.1
  Copyright (c) 2013-2014 Vidigami
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/vidigami/backbone-http
  Dependencies: Backbone.js, Underscore.js, and BackboneORM.
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone-orm"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone-orm"], factory);
	else if(typeof exports === 'object')
		exports["BackboneHTTP"] = factory(require("backbone-orm"));
	else
		root["BackboneHTTP"] = factory(root["BackboneORM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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
	  backbone-http.js 0.6.1
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-http
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, BackboneHTTP, BackboneORM, key, publish, value, _, _ref, _ref1;

	_ref = BackboneORM = __webpack_require__(1), _ = _ref._, Backbone = _ref.Backbone;

	module.exports = BackboneHTTP = __webpack_require__(2);

	publish = {
	  configure: __webpack_require__(4),
	  sync: __webpack_require__(3),
	  _: _,
	  Backbone: Backbone
	};

	_.extend(BackboneHTTP, publish);

	BackboneHTTP.modules = {
	  'backbone-orm': BackboneORM
	};

	_ref1 = BackboneORM.modules;
	for (key in _ref1) {
	  value = _ref1[key];
	  BackboneHTTP.modules[key] = value;
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-http.js 0.6.1
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-http
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Backbone, BackboneORM, CAPABILITIES, HTTPCursor, HTTPSync, JSONUtils, Schema, URL, Utils, backboneSync, _, _ref;

	_ref = BackboneORM = __webpack_require__(1), _ = _ref._, Backbone = _ref.Backbone, Utils = _ref.Utils, JSONUtils = _ref.JSONUtils, Schema = _ref.Schema;

	URL = BackboneORM.modules.url;

	backboneSync = Backbone.sync;

	HTTPCursor = __webpack_require__(5);

	CAPABILITIES = {
	  embed: 'maybe',
	  json: 'maybe',
	  unique: 'maybe',
	  manual_ids: false,
	  self_reference: 'maybe'
	};

	HTTPSync = (function() {
	  function HTTPSync(model_type, options) {
	    this.model_type = model_type;
	    if (options == null) {
	      options = {};
	    }
	    this.model_type.model_name = Utils.findOrGenerateModelName(this.model_type);
	    if (!(this.url = _.result(new this.model_type, 'url'))) {
	      throw new Error("Missing url for model: " + this.model_type);
	    }
	    this.schema = new Schema(this.model_type, {
	      id: {
	        type: '_raw'
	      }
	    });
	    this.beforeSend = options.beforeSend;
	    this.event_emitter = _.extend({}, Backbone.Events);
	  }

	  HTTPSync.prototype.initialize = function(model) {
	    if (this.is_initialized) {
	      return;
	    }
	    this.is_initialized = true;
	    return this.schema.initialize();
	  };

	  HTTPSync.prototype.resetSchema = function(options, callback) {
	    return this.http('delete', null, {}, callback);
	  };

	  HTTPSync.prototype.cursor = function(query) {
	    if (query == null) {
	      query = {};
	    }
	    return new HTTPCursor(query, {
	      model_type: this.model_type,
	      sync: this
	    });
	  };

	  HTTPSync.prototype.destroy = function(query, callback) {
	    var _ref1;
	    if (arguments.length === 1) {
	      _ref1 = [{}, query], query = _ref1[0], callback = _ref1[1];
	    }
	    return this.http('delete', null, {
	      query: query
	    }, callback);
	  };

	  HTTPSync.prototype.http = function(method, model, options, callback) {
	    var url, url_parts;
	    url = model ? _.result(model, 'url') : this.url;
	    if (options.query && _.size(options.query)) {
	      url_parts = URL.parse(url, true);
	      _.extend(url_parts.query, JSONUtils.toQuery(options.query));
	      url = URL.format(url_parts);
	    }
	    return backboneSync(method, model || this.event_emitter, _.extend({
	      url: url,
	      beforeSend: this.beforeSend
	    }, options, {
	      success: function(res) {
	        return callback(null, JSONUtils.parse(res));
	      },
	      error: function(res) {
	        return callback(_.extend(new Error("Ajax failed with status " + res.status + " for " + method), {
	          status: res.status
	        }));
	      }
	    }));
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
	    var url;
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
	      if (method === 'read') {
	        options = _.extend({
	          $one: !model.models
	        }, options);
	      }
	      sync.http(method, model, _.omit(options, 'error', 'success'), (function(_this) {
	        return function(err, res) {
	          if (err) {
	            return options.error(err);
	          } else {
	            return options.success(res);
	          }
	        };
	      })(this));
	      return;
	    }
	    if (sync[method]) {
	      return sync[method].apply(sync, Array.prototype.slice.call(arguments, 1));
	    } else {
	      return void 0;
	    }
	  };
	  Utils.configureModelType(type);
	  return BackboneORM.model_cache.configureSync(type, sync_fn);
	};

	module.exports.capabilities = function(url) {
	  return CAPABILITIES;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1).configure;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  backbone-http.js 0.6.1
	  Copyright (c) 2013-2014 Vidigami
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/vidigami/backbone-http
	  Dependencies: Backbone.js and Underscore.js.
	 */
	var Cursor, HTTPCursor, _, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	_ref = __webpack_require__(1), _ = _ref._, Cursor = _ref.Cursor;

	module.exports = HTTPCursor = (function(_super) {
	  __extends(HTTPCursor, _super);

	  function HTTPCursor() {
	    return HTTPCursor.__super__.constructor.apply(this, arguments);
	  }

	  HTTPCursor.prototype.toJSON = function(callback) {
	    var query;
	    if (this.hasCursorQuery('$zero')) {
	      return callback(null, this.hasCursorQuery('$one') ? null : []);
	    }
	    return this.sync.http('read', null, {
	      query: query = _.extend({}, this._find, this._cursor)
	    }, (function(_this) {
	      return function(err, res) {
	        if (query.$one && err && (err.status === 404)) {
	          return callback(null, null);
	        }
	        return callback(null, _this.hasCursorQuery('$count') || _this.hasCursorQuery('$exists') ? res.result : res);
	      };
	    })(this));
	  };

	  return HTTPCursor;

	})(Cursor);


/***/ }
/******/ ])
})
