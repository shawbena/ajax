# ajax

ajax method selft implementation

## syntax:

```js
ajax(config | url, success, error);
```

url: String

config Object

- `async`, boolean, default: true

- `dataType`: String, 'json' | 'formData', default: null. data type sending to server

- `headers`: key value pair Object, default: {}. [About headers](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader).

- `method`: String, 'get' | 'post', default: 'get'.

- `password`: default: null,

- `progress`: default: null,

- `responseType`: default: null,

- `url`: default: null,

- `user`: default: null,

## usage:

```js
import ajax from 'path/ajax';
ajax({
    method: 'post'
    url: 'yourURL'
}, (res) => {

});

ajax({
    method: 'post'
    url: 'yourURL',
    data: {
        name: 'zhang san'
    },
    dataType: 'json'
}, (res) => {

});

ajax({
    method: 'post'
    url: 'yourURL',
    data: {
        name: 'zhang san',
        jianli: new File()
    },
    dataType: 'formData'
}, (res) => {

});

// get method
ajax('yourURL', (res) => {

});

// or get
ajax({
    method: 'get',
    url: 'yourURL',
    data: {
        name: 'zhangsan',
        address: 'Beijing China'
    }
}, (res) => {

});
```

## LISCENSE

MIT liscense.
