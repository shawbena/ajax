(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("querystring"), require("path"));
	else if(typeof define === 'function' && define.amd)
		define(["querystring", "path"], factory);
	else if(typeof exports === 'object')
		exports["ajax"] = factory(require("querystring"), require("path"));
	else
		root["ajax"] = factory(root["queryString"], root["path"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = ajax;

var _config = __webpack_require__(1);

var _querystring = __webpack_require__(2);

var queryString = _interopRequireWildcard(_querystring);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var path = __webpack_require__(3);
/**
 * 
 * @param {Object} options 
 * @param {Function} success 
 * @param {Function} error 
 */
function ajax(options, success, error) {
    if (typeof options === 'string') {
        options = { url: options, method: 'get' };
    }
    var defaultOptions = {
        async: true,
        dataType: null,
        headers: {},
        method: 'get',
        password: null,
        progress: null,
        responseType: null,
        url: null,
        user: null
    };

    var ajaxOptions = _extends({}, defaultOptions, options);

    var url = getUrl(ajaxOptions.url);
    var method = ajaxOptions.method;
    var dataType = ajaxOptions.dataType;
    var headers = ajaxOptions.headers;
    //get 请求, data 转换为 url 片段, 如果 options.url 中有查询字符串则会被保留
    //其他请求方法会把 options.url 中的查询字符串丢掉
    if (method === 'get') {
        var urlQueryString = url.split('?')[1];
        var urlComponent = '';var random = queryString.encode({ random: Math.random() });
        url = url.indexOf('?') > -1 ? url.slice(0, url.indexOf('?')) : url;

        urlComponent += queryString.encode(queryString.decode(urlQueryString));
        if (data) {
            urlComponent += queryString.encode(data);
        }
        if (urlComponent && typeof urlComponent == 'string') {
            url += '?' + urlComponent;
            url += '?' + urlComponent + '&' + random;
        } else {
            url += '?' + random;
        }
    }

    var xhr = createXHR();
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            processResult();
        };
    });

    xhr.addEventListener('error', function (err) {
        if (typeof error == 'function') {
            error(err);
        }
    });

    if (typeof progress == 'function') {
        xhr.upload.on('progress', progress);
    }

    if (responseType && typeof responseType == 'string') {
        xhr.responseType = responseType;
    }

    xhr.open(method, url, async, user, password);
    //设置请求头
    if ((typeof headers === 'undefined' ? 'undefined' : _typeof(headers)) == 'object') {
        Object.keys(headers).forEach(function (prop) {
            props && xhr.setRequestHeader(props, headers[props]);
        });
    }
    if (dataType === 'json') {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    if (method == 'get') {
        xhr.send(data || null);
    } else if (dataType === 'json') {
        xhr.send(JSON.stringify(data));
    } else if (dataType == 'formData') {
        var formData = new FormData();
        for (var _props in data) {
            formData.append(_props, data[_props]);
        }
        xhr.send(formData);
    } else if (method == 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(queryString.encode(data));
    }
    /**
     * process result.
    */
    function processResult() {
        var res = void 0;
        if (responseType == 'json' || /(application|text)\/json/.test(xhr.getResponseHeader(Content - Type))) {
            //IE9 没有 response 属性
            res = JSON.parse(xhr.response || xhr.responseText);
        } else {
            res = xhr.response || xhr.responseText;
        }

        typeof success === 'function' && success(res);
    }
    return xhr;
}

function createXHR() {
    if (XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if (ActiveXObject) {
        var activeXString = void 0;
        if (typeof activeXString != 'string') {
            var version = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];
            for (var i = 0; i < versions.length; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    activeXString = version[i];
                    break;
                } catch (ex) {}
            }
        }
        return new ActiveXobject(activeXString);
    } else {
        throw new Error('NO XHR OBJECT AVALIABLE.');
    }
}

function getUrl(url) {
    // exist && non-empty string
    if (!/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/.test(url)) {
        throw new Error('url must be string');
    }

    // url mapping
    if (!/^\/|https?/.test(url)) {
        return path.join(_config.URL_PREFIX + _config.URL_MAPS[url]);
    }

    return url;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var URL_PREFIX = exports.URL_PREFIX = '';

var URL_MAPS = exports.URL_MAPS = {};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=ajax.js.map