import { URL_MAPS, URL_PREFIX } from './config';
import * as queryString from 'querystring';

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
    options = options || {};
    let url = options.url;
    let method = options.method || 'get';
    let async = options.async || true;
    let user = options.user;
    let password = options.password;
    let headers = options.headers || {};
    let progress = options.progress;
    let data = options.data;
    let dataType = options.dataType;
    let responseType = options.responseType;
    let xhr;
    if (typeof url != 'string') {
        throwError('url 不存在或不是字符串！');
    }
    if (!/^\//.test(url) && !/^https?:/.test(url)) {
        url = URL_MAPS[url];
        if(!url){
            throw Error('url not exist or invalide');
        }
        if(url.indexOf('/') == 0){
            url = URL_PREFIX + url;
        }else{
            url = URL_PREFIX + '/' + url;
        }
    }
    //get 请求, data 转换为 url 片段, 如果 options.url 中有查询字符串则会被保留
    //其他请求方法会把 options.url 中的查询字符串丢掉
    if (method === 'get') {
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
    if (responseType && typeof responseType == 'string') {
        xhr.responseType = responseType;
    }
    xhr.open(method, url, async, user, password);
    //设置请求头
    if (typeof headers == 'object') {
        for (let props in headers) {
            xhr.setRequestHeader(props, headers[props]);
        }
    }
    if(dataType === 'json'){
        xhr.setRequestHeader('Content-Type', 'application/json');
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
    //处理响应原始数据
    function processResult() {
        if (typeof success != 'function') {
            throwError('成功回调不存在或者不是函数');
        }
        let res;
        let contentTypeJson = xhr.getResponseHeader('Content-Type').indexOf('application/json') == 0 ? true : false;
        if (responseType == 'json' || contentTypeJson) {
            //IE9 没有 response 属性
            res = JSON.parse(xhr.response || xhr.responseText);
        } else {
            res = xhr.response || xhr.responseText;
        }
        if(res.record == 1504){
            popo('用户未登录或登录过期，请重新登录');
            setTimeout(function() {
                window.location = 'login';
            }, 800);
            return;
        }
        success(res);
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