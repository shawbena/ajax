import { URL_MAPS, URL_PREFIX } from './config';
import * as queryString from 'querystring';
const path = require('path');
/**
 * 
 * @param {Object} options 
 * @param {Function} success 
 * @param {Function} error 
 */
export default function ajax(options, success, error) {
    if(typeof options === 'string'){
        options = {url: options, method: 'get'};
    }
    let defaultOptions = {
        async: true,
        dataType: null,
        headers: {},
        method: 'get',
        password: null,
        progress: null,
        responseType: null,
        url: null,
        user: null,
    };

    let ajaxOptions = { ...defaultOptions, ...options };

    
    let url = getUrl(ajaxOptions.url);
    let method = ajaxOptions.method;
    let dataType = ajaxOptions.dataType;
    let headers = ajaxOptions.headers;
    //get 请求, data 转换为 url 片段, 如果 options.url 中有查询字符串则会被保留
    //其他请求方法会把 options.url 中的查询字符串丢掉
    if (method === 'get') {
        let urlQueryString = url.split('?')[1];
        let urlComponent = '';let random = queryString.encode({ random: Math.random() });
        url = url.indexOf('?') > -1 ? url.slice(0, url.indexOf('?')) : url;

        urlComponent += queryString.encode(queryString.decode(urlQueryString));
        if (data) {
            urlComponent += queryString.encode(data)
        }
        if (urlComponent && typeof urlComponent == 'string') {
            url += '?' + urlComponent;
            url += `?${urlComponent}&${random}`;
        }else{
            url += `?${random}`
        }
    }

    let xhr = createXHR();
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
    if (typeof headers == 'object') {
        Object.keys(headers).forEach((prop) => {
            props && xhr.setRequestHeader(props, headers[props]);
        });
    }
    if(dataType === 'json'){
        xhr.setRequestHeader('Content-Type', 'application/json');
    }
    

    if (method == 'get') {
        xhr.send(data || null);
    } else if (dataType === 'json') {
        xhr.send(JSON.stringify(data));
    } else if (dataType == 'formData') {
        let formData = new FormData();
        for (let props in data) {
            formData.append(props, data[props]);
        }
        xhr.send(formData);
    } else if (method == 'post') {
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.send(queryString.encode(data));
    }
    /**
     * process result.
    */
    function processResult() {
        let res;
        if (responseType == 'json' || /(application|text)\/json/.test(xhr.getResponseHeader(Content-Type))) {
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


function getUrl(url){
    // exist && non-empty string
    if (!/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/.test(url)) {
        throw new Error('url must be string');
    }

    // url mapping
    if (!/^\/|https?/.test(url)) {
        return path.join(URL_PREFIX + URL_MAPS[url]);
    }

    return url;
}