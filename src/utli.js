import { InterFace } from 'config';

let queryString = {
    /*
    处理查询字符串，encode(), decode()
    encode(obj, name, sep, eq)
    将对象解析为 encodeURIComponent() 编码的字符串，object 是必须的。
    如果有 name, obj 应该为 <String> 类型。
    如果 obj 中属性值为数组：
        obj{
            name: ['xiaoming', 'xiaoqiang']
        }
    解析结果为：
        name=xiaoming&name=xiaoqiang

    */
    decode(qs, sep, eq, options) {
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
    encode(obj, sep, eq, name) {
        sep = sep || '&';
        eq = eq || '=';
        if (obj === null) {
            obj = undefined;
        }

        if (typeof obj === 'object') {
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
        return encodeURIComponent(stringifyPrimitive(name)) + eq +
            encodeURIComponent(stringifyPrimitive(obj));
    }
};

function addURLParam(url, name, value) {
    url += (url.indexOf('?') == -1 ? '?' : '&');
    url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
    return url;
}
function createXHR() {
    if (XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if (ActiveXObject) {
        let activeXString;
        if (typeof activeXString != 'string') {
            let version = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];
            for (let i = 0; i < versions.length; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    activeXString = version[i];
                    break;
                } catch (ex) {

                }
            }
        }
        return new ActiveXobject(activeXString);
    } else {
        throw new Error('NO XHR OBJECT AVALIABLE.');
    }
}

//ajax
function ajax(options, success, error) {
    options = options || {};
    let url = options.url;
    let method = options.method || 'get';
    let async = options.async || true;
    let user = options.user;
    let password = options.password;
    let headers = options.headers || {};
    let progress = options.progress;
    let data = options.data;
    let responseType = options.responseType;
    let xhr;
    if (typeof url != 'string') {
        throwError('url 不存在或不是字符串！');
    }
    if (!/^\//.test(url) && !/^https?:/.test(url)) {
        url = InterFace[url];
    }
    //get 请求, data 转换为 url 片段, 如果 options.url 中有查询字符串则会被保留
    //其他请求方法会把 options.url 中的查询字符串丢掉
    if (method == 'get') {
        let urlQueryString = url.split('?')[1];
        let urlComponent = '';
        url = url.indexOf('?') > -1 ? url.slice(0, url.indexOf('?')) : url;

        urlComponent += queryString.encode(queryString.decode(urlQueryString));
        if (data) {
            urlComponent += queryString.encode(data)
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
    }
    if (typeof responseType == 'string') {
        xhr.responseType = responseType;
    } else {
        responseType = 'json';
        xhr.responseType = responseType;
    }
    xhr.open(method, url, async, user, password);
    //设置请求头
    if (method == 'post' && (!headers['Content-Type'] || headers['Content-Type'].indexOf('application/x-www-form-urlencoded') == 0)) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    if (typeof headers == 'object') {
        for (let props in headers) {
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
    }else if (headers && headers['Content-Type'] && headers['Content-Type'].indexOf('application/json') == 0) {
        xhr.send(JSON.stringify(data));
    } else if (headers && headers['Content-Type'] === 'multipart/form-data') {
        let formData = new FormData();
        for (let props in data) {
            formData.append(props, data[props]);
        }
        xhr.send(formData);
    }else if(method == 'post'){
        xhr.send(queryString.encode(data));
    }
    //处理响应原始数据
    function processResult() {
        if (typeof success != 'function') {
            throwError('成功回调不存在或者不是函数');
        }
        let res;
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
//序列化表单
function serializeForm(form) {
    let parts = [];
    let field = null;
    let option;
    let optValue;
    for (let i = 0; i < form.elements.length; i++) {
        field = form.elements[i];
        switch (field.type) {
            case 'select-one':
            case 'select-mutiple':
                if (field.name.length) {
                    for (let j = 0; j < field.options.length; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = '';
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute('value') ? option.value : option.text);
                            } else {
                                optValue = (option.attributes['value'].specified ? option.value : option.text);
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
            /* 执行默认操作 */
            default:
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
                }
        }
    }
    return parts.join('&');
}
/**
 * 字符串化输入
 * @param {any} v
 * @returns <String>
 */
function stringifyPrimitive(v) {
    switch (typeof v) {
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
export {
    queryString,
    createXHR,
    ajax,
    querySelector,
    serialize
}