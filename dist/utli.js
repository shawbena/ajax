define(['exports', 'config'], function (exports, _config) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.serialize = exports.querySelector = exports.ajax = exports.createXHR = exports.queryString = undefined;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var queryString = {
        decode: function decode(qs, sep, eq, options) {
            sep = sep || '&';
            eq = eq || '=';
            var obj = {};

            if (typeof qs !== 'string' || qs.length === 0) {
                return obj;
            }

            var regexp = /\+/g;
            qs = qs.split(sep);

            var maxKeys = 1000;
            if (options && typeof options.maxKeys === 'number') {
                maxKeys = options.maxKeys;
            }

            var len = qs.length;

            if (maxKeys > 0 && len > maxKeys) {
                len = maxKeys;
            }

            for (var i = 0; i < len; ++i) {
                var x = qs[i].replace(regexp, '%20'),
                    idx = x.indexOf(eq),
                    kstr,
                    vstr,
                    k,
                    v;

                if (idx >= 0) {
                    kstr = x.substr(0, idx);
                    vstr = x.substr(idx + 1);
                } else {
                    kstr = x;
                    vstr = '';
                }

                k = decodeURIComponent(kstr);
                v = decodeURIComponent(vstr);

                if (!hasOwnProperty(obj, k)) {
                    obj[k] = v;
                } else if (Array.isArray(obj[k])) {
                    obj[k].push(v);
                } else {
                    obj[k] = [obj[k], v];
                }
            }

            return obj;
        },
        encode: function encode(obj, sep, eq, name) {
            sep = sep || '&';
            eq = eq || '=';
            if (obj === null) {
                obj = undefined;
            }

            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
                return Object.keys(obj).map(function (k) {
                    var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                    if (Array.isArray(obj[k])) {
                        return obj[k].map(function (v) {
                            return ks + encodeURIComponent(stringifyPrimitive(v));
                        }).join(sep);
                    } else {
                        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                    }
                }).join(sep);
            }

            if (!name) return '';
            return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
        }
    };

    function addURLParam(url, name, value) {
        url += url.indexOf('?') == -1 ? '?' : '&';
        url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
        return url;
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

    function ajax(options, success, error) {
        options = options || {};
        var url = options.url;
        var method = options.method || 'get';
        var async = options.async || true;
        var user = options.user;
        var password = options.password;
        var headers = options.headers || {};
        var progress = options.progress;
        var data = options.data;
        var responseType = options.responseType;
        var xhr = void 0;
        if (typeof url != 'string') {
            throwError('url 不存在或不是字符串！');
        }
        if (!/^\//.test(url) && !/^https?:/.test(url)) {
            url = _config.InterFace[url];
        }

        if (method == 'get') {
            var urlQueryString = url.split('?')[1];
            var urlComponent = '';
            url = url.indexOf('?') > -1 ? url.slice(0, url.indexOf('?')) : url;

            urlComponent += queryString.encode(queryString.decode(urlQueryString));
            if (data) {
                urlComponent += queryString.encode(data);
            }
            if (urlComponent && typeof urlComponent == 'string') {
                url += '?' + urlComponent;
            }
        }
        xhr = createXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                processResult();
            };
        };
        if (typeof responseType == 'string') {
            xhr.responseType = responseType;
        } else {
            responseType = 'json';
            xhr.responseType = responseType;
        }
        xhr.open(method, url, async, user, password);

        if (method == 'post' && (!headers['Content-Type'] || headers['Content-Type'].indexOf('application/x-www-form-urlencoded') == 0)) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        if ((typeof headers === 'undefined' ? 'undefined' : _typeof(headers)) == 'object') {
            for (var props in headers) {
                xhr.setRequestHeader(props, headers[props]);
            }
        }

        if (typeof progress == 'function') {
            xhr.upload.on('progress', progress);
        }
        xhr.onerror = function (err) {
            if (typeof error == 'function') {
                error(err);
            }
        };
        if (method == 'get') {
            xhr.send(data || null);
        } else if (headers && headers['Content-Type'] && headers['Content-Type'].indexOf('application/json') == 0) {
            xhr.send(JSON.stringify(data));
        } else if (headers && headers['Content-Type'] === 'multipart/form-data') {
            var formData = new FormData();
            for (var _props in data) {
                formData.append(_props, data[_props]);
            }
            xhr.send(formData);
        } else if (method == 'post') {
            xhr.send(queryString.encode(data));
        }

        function processResult() {
            if (typeof success != 'function') {
                throwError('成功回调不存在或者不是函数');
            }
            var res = void 0;
            if (xhr.responseType == '' || xhr.responseType == 'text') {
                res = JSON.parse(res.response);
            } else {
                res = xhr.response;
            }
            success(res);
        }
        return xhr;
    }

    function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    function querySelector(selector) {
        return document.querySelector(selector);
    }

    function serialize(form) {
        var parts = [];
        var field = null;
        var option = void 0;
        var optValue = void 0;
        for (var i = 0; i < form.elements.length; i++) {
            field = form.elements[i];
            switch (field.type) {
                case 'select-one':
                case 'select-mutiple':
                    if (field.name.length) {
                        for (var j = 0; j < field.options.length; j++) {
                            option = field.options[j];
                            if (option.selected) {
                                optValue = '';
                                if (option.hasAttribute) {
                                    optValue = option.hasAttribute('value') ? option.value : option.text;
                                } else {
                                    optValue = option.attributes['value'].specified ? option.value : option.text;
                                }
                                parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(optValue));
                            }
                        }
                    }
                    break;
                case undefined:
                case 'file':
                case 'submit':
                case 'reset':
                case 'button':
                    break;
                case 'radio':
                case 'checkbox':
                    if (!field.checked) {
                        break;
                    }

                default:
                    if (field.name.length) {
                        parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
                    }
            }
        }
        return parts.join('&');
    }

    function stringifyPrimitive(v) {
        switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
            case 'string':
                return v;
            case 'boolean':
                return v ? 'true' : 'false';
            case 'number':
                return isFinite(v) ? v.toString() : '';
            default:
                return '';
        }
    };
    exports.queryString = queryString;
    exports.createXHR = createXHR;
    exports.ajax = ajax;
    exports.querySelector = querySelector;
    exports.serialize = serialize;
});