/*
  backbone-http.js 0.6.0
  Copyright (c) 2013-2014 Vidigami
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/vidigami/backbone-http
  Dependencies: Backbone.js, Underscore.js, and Moment.js.
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone-orm"), require("underscore"), require("backbone"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone-orm", "underscore", "backbone"], factory);
	else if(typeof exports === 'object')
		exports["BackboneHTTP"] = factory(require("backbone-orm"), require("underscore"), require("backbone"));
	else
		root["BackboneHTTP"] = factory(root["BackboneORM"], root["_"], root["Backbone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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

	BackboneORM = __webpack_require__(1);

	module.exports = {
	  sync: __webpack_require__(2),
	  _: BackboneORM._,
	  Backbone: BackboneORM.Backbone,
	  modules: {
	    'backbone-orm': BackboneORM
	  }
	};

	_ref = ['url', 'querystring', 'lru-cache', 'underscore', 'backbone', 'inflection', 'stream'];
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

	
	/*
	  backbone-http.js 0.6.0
	  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-http
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Dependencies: Backbone.js, Underscore.js, Moment.js, Inflection.js, BackboneORM, and Superagent.
	 */
	var Backbone, HTTPCursor, HTTPSync, JSONUtils, ModelCache, Schema, URL, Utils, backboneSync, bborm, _;

	_ = __webpack_require__(3);

	Backbone = __webpack_require__(4);

	backboneSync = Backbone.sync;

	bborm = __webpack_require__(1);

	Schema = bborm.Schema;

	Utils = bborm.Utils;

	JSONUtils = bborm.JSONUtils;

	ModelCache = bborm.CacheSingletons.ModelCache;

	HTTPCursor = __webpack_require__(5);

	URL = __webpack_require__(6);

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
	    var _ref;
	    if (arguments.length === 1) {
	      _ref = [{}, query], query = _ref[0], callback = _ref[1];
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
	  return ModelCache.configureSync(type, sync_fn);
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
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

	_ = __webpack_require__(3);

	Cursor = __webpack_require__(1).Cursor;

	JSONUtils = __webpack_require__(1).JSONUtils;

	Utils = __webpack_require__(1).Utils;

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
	      query: query = _.extend(_.clone(this._find), this._cursor)
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var punycode = { encode : function (s) { return s } };
	var util = __webpack_require__(7);
	var shims = __webpack_require__(8);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(9);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && util.isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!util.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = shims.trim(rest);

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (util.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      util.isObject(this.query) &&
	      shims.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && shims.substr(protocol, -1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (util.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  shims.forEach(shims.keys(this), function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    shims.forEach(shims.keys(relative), function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      shims.forEach(shims.keys(relative), function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!util.isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (shims.substr(srcPath.join('/'), -1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var shims = __webpack_require__(8);

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	return shims.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	return typeof arg === 'string';
	}
	exports.isString = isString;

	function isObject(arg) {
	return typeof arg === 'object' && arg;
	}
	exports.isObject = isObject;

	function objectToString(o) {
	return Object.prototype.toString.call(o);
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	//
	// The shims in this file are not fully implemented shims for the ES5
	// features, but do work for the particular usecases there is in
	// the other modules.
	//

	var toString = Object.prototype.toString;
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	// Array.isArray is supported in IE9
	function isArray(xs) {
	  return toString.call(xs) === '[object Array]';
	}
	exports.isArray = typeof Array.isArray === 'function' ? Array.isArray : isArray;

	// Array.prototype.indexOf is supported in IE9
	exports.indexOf = function indexOf(xs, x) {
	  if (xs.indexOf) return xs.indexOf(x);
	  for (var i = 0; i < xs.length; i++) {
	    if (x === xs[i]) return i;
	  }
	  return -1;
	};

	// Array.prototype.filter is supported in IE9
	exports.filter = function filter(xs, fn) {
	  if (xs.filter) return xs.filter(fn);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    if (fn(xs[i], i, xs)) res.push(xs[i]);
	  }
	  return res;
	};

	// Array.prototype.forEach is supported in IE9
	exports.forEach = function forEach(xs, fn, self) {
	  if (xs.forEach) return xs.forEach(fn, self);
	  for (var i = 0; i < xs.length; i++) {
	    fn.call(self, xs[i], i, xs);
	  }
	};

	// Array.prototype.map is supported in IE9
	exports.map = function map(xs, fn) {
	  if (xs.map) return xs.map(fn);
	  var out = new Array(xs.length);
	  for (var i = 0; i < xs.length; i++) {
	    out[i] = fn(xs[i], i, xs);
	  }
	  return out;
	};

	// Array.prototype.reduce is supported in IE9
	exports.reduce = function reduce(array, callback, opt_initialValue) {
	  if (array.reduce) return array.reduce(callback, opt_initialValue);
	  var value, isValueSet = false;

	  if (2 < arguments.length) {
	    value = opt_initialValue;
	    isValueSet = true;
	  }
	  for (var i = 0, l = array.length; l > i; ++i) {
	    if (array.hasOwnProperty(i)) {
	      if (isValueSet) {
	        value = callback(value, array[i], i, array);
	      }
	      else {
	        value = array[i];
	        isValueSet = true;
	      }
	    }
	  }

	  return value;
	};

	// String.prototype.substr - negative index don't work in IE8
	if ('ab'.substr(-1) !== 'b') {
	  exports.substr = function (str, start, length) {
	    // did we get a negative start, calculate how much it is from the beginning of the string
	    if (start < 0) start = str.length + start;

	    // call the original function
	    return str.substr(start, length);
	  };
	} else {
	  exports.substr = function (str, start, length) {
	    return str.substr(start, length);
	  };
	}

	// String.prototype.trim is supported in IE9
	exports.trim = function (str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	};

	// Function.prototype.bind is supported in IE9
	exports.bind = function () {
	  var args = Array.prototype.slice.call(arguments);
	  var fn = args.shift();
	  if (fn.bind) return fn.bind.apply(fn, args);
	  var self = args.shift();
	  return function () {
	    fn.apply(self, args.concat([Array.prototype.slice.call(arguments)]));
	  };
	};

	// Object.create is supported in IE9
	function create(prototype, properties) {
	  var object;
	  if (prototype === null) {
	    object = { '__proto__' : null };
	  }
	  else {
	    if (typeof prototype !== 'object') {
	      throw new TypeError(
	        'typeof prototype[' + (typeof prototype) + '] != \'object\''
	      );
	    }
	    var Type = function () {};
	    Type.prototype = prototype;
	    object = new Type();
	    object.__proto__ = prototype;
	  }
	  if (typeof properties !== 'undefined' && Object.defineProperties) {
	    Object.defineProperties(object, properties);
	  }
	  return object;
	}
	exports.create = typeof Object.create === 'function' ? Object.create : create;

	// Object.keys and Object.getOwnPropertyNames is supported in IE9 however
	// they do show a description and number property on Error objects
	function notObject(object) {
	  return ((typeof object != "object" && typeof object != "function") || object === null);
	}

	function keysShim(object) {
	  if (notObject(object)) {
	    throw new TypeError("Object.keys called on a non-object");
	  }

	  var result = [];
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name)) {
	      result.push(name);
	    }
	  }
	  return result;
	}

	// getOwnPropertyNames is almost the same as Object.keys one key feature
	//  is that it returns hidden properties, since that can't be implemented,
	//  this feature gets reduced so it just shows the length property on arrays
	function propertyShim(object) {
	  if (notObject(object)) {
	    throw new TypeError("Object.getOwnPropertyNames called on a non-object");
	  }

	  var result = keysShim(object);
	  if (exports.isArray(object) && exports.indexOf(object, 'length') === -1) {
	    result.push('length');
	  }
	  return result;
	}

	var keys = typeof Object.keys === 'function' ? Object.keys : keysShim;
	var getOwnPropertyNames = typeof Object.getOwnPropertyNames === 'function' ?
	  Object.getOwnPropertyNames : propertyShim;

	if (new Error().hasOwnProperty('description')) {
	  var ERROR_PROPERTY_FILTER = function (obj, array) {
	    if (toString.call(obj) === '[object Error]') {
	      array = exports.filter(array, function (name) {
	        return name !== 'description' && name !== 'number' && name !== 'message';
	      });
	    }
	    return array;
	  };

	  exports.keys = function (object) {
	    return ERROR_PROPERTY_FILTER(object, keys(object));
	  };
	  exports.getOwnPropertyNames = function (object) {
	    return ERROR_PROPERTY_FILTER(object, getOwnPropertyNames(object));
	  };
	} else {
	  exports.keys = keys;
	  exports.getOwnPropertyNames = getOwnPropertyNames;
	}

	// Object.getOwnPropertyDescriptor - supported in IE8 but only on dom elements
	function valueObject(value, key) {
	  return { value: value[key] };
	}

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
	  try {
	    Object.getOwnPropertyDescriptor({'a': 1}, 'a');
	    exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	  } catch (e) {
	    // IE8 dom element issue - use a try catch and default to valueObject
	    exports.getOwnPropertyDescriptor = function (value, key) {
	      try {
	        return Object.getOwnPropertyDescriptor(value, key);
	      } catch (e) {
	        return valueObject(value, key);
	      }
	    };
	  }
	} else {
	  exports.getOwnPropertyDescriptor = valueObject;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// Query String Utilities

	var QueryString = exports;
	var util = __webpack_require__(7);
	var shims = __webpack_require__(8);

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
	}


	function charCode(c) {
	return c.charCodeAt(0);
	}

	// TODO support returning arbitrary buffers.

	QueryString.unescape = function(s, decodeSpaces) {
	return decodeURIComponent(s/*, decodeSpaces*/);
	};


	QueryString.escape = function(str) {
	return encodeURIComponent(str);
	};

	var stringifyPrimitive = function(v) {
	if (util.isString(v))
	  return v;
	if (util.isBoolean(v))
	  return v ? 'true' : 'false';
	if (util.isNumber(v))
	  return isFinite(v) ? v : '';
	return '';
	};


	QueryString.stringify = QueryString.encode = function(obj, sep, eq, name) {
	sep = sep || '&';
	eq = eq || '=';
	if (util.isNull(obj)) {
	  obj = undefined;
	}

	if (util.isObject(obj)) {
	  return shims.map(shims.keys(obj), function(k) {
	    var ks = QueryString.escape(stringifyPrimitive(k)) + eq;
	    if (util.isArray(obj[k])) {
	      return shims.map(obj[k], function(v) {
	        return ks + QueryString.escape(stringifyPrimitive(v));
	      }).join(sep);
	    } else {
	      return ks + QueryString.escape(stringifyPrimitive(obj[k]));
	    }
	  }).join(sep);

	}

	if (!name) return '';
	return QueryString.escape(stringifyPrimitive(name)) + eq +
	       QueryString.escape(stringifyPrimitive(obj));
	};

	// Parse a key=val string.
	QueryString.parse = QueryString.decode = function(qs, sep, eq, options) {
	sep = sep || '&';
	eq = eq || '=';
	var obj = {};

	if (!util.isString(qs) || qs.length === 0) {
	  return obj;
	}

	var regexp = /\+/g;
	qs = qs.split(sep);

	var maxKeys = 1000;
	if (options && util.isNumber(options.maxKeys)) {
	  maxKeys = options.maxKeys;
	}

	var len = qs.length;
	// maxKeys <= 0 means that we should not limit keys count
	if (maxKeys > 0 && len > maxKeys) {
	  len = maxKeys;
	}

	for (var i = 0; i < len; ++i) {
	  var x = qs[i].replace(regexp, '%20'),
	      idx = x.indexOf(eq),
	      kstr, vstr, k, v;

	  if (idx >= 0) {
	    kstr = x.substr(0, idx);
	    vstr = x.substr(idx + 1);
	  } else {
	    kstr = x;
	    vstr = '';
	  }

	  try {
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	  } catch (e) {
	    k = QueryString.unescape(kstr, true);
	    v = QueryString.unescape(vstr, true);
	  }

	  if (!hasOwnProperty(obj, k)) {
	    obj[k] = v;
	  } else if (util.isArray(obj[k])) {
	    obj[k].push(v);
	  } else {
	    obj[k] = [obj[k], v];
	  }
	}

	return obj;
	};

/***/ }
/******/ ])
})
