# ajax(options, success, error);

`options`: <Object>
- `url`: <String>, required
- `method`: <String>, optiional, default: 'get'
- `async` : <Boolean>, optional, default: true,
- `user`: <String>, optional
- `password`: <String>, optional
- `headers`: <Object>, <key, value> pairs, optional
- `data`: <Object>, <key, value> pairs
- `responseType`: <String>, optional, default: 'josn', more at https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType

`success`: <Function>, required
`error`: <Function>, optional

# get 方法

get 方法可以传 data, url 中可以有查询字符串

# post 方法

默认 Content-Type 为 application/x-www-form-urlencoded

json 请求请将请求头 `Content-Type` 为 `application/json`:

```js
let data = {
    name: 'caca'
};
ajax({
    method: 'post',
    url: '/haha',
    headers: {
        'Content-Type': 'application/json'
    }
    data
}, (res) => {

})
```

带文件的请求可将 `Content-Type` 设置为 `multipart/form-data`:

```js
let data = {
    name: 'caca'
};
ajax({
    method: 'post',
    url: '/haha',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
    data
}, (res) => {

})
```