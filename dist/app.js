define(['exports', 'utli'], function (exports, _utli) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.bootstrap = undefined;


    function bootstrap() {
        var userInfoBtn = (0, _utli.querySelector)('#user_info_btn');
        var newUserForm = (0, _utli.querySelector)('#new_user_form');
        var uploadUserInfoForm = (0, _utli.querySelector)('#upload_user_info');
        var getUserInfoBtn = (0, _utli.querySelector)('#get_user_info');
        userInfoBtn.addEventListener('click', function () {
            var xhr = (0, _utli.createXHR)();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        console.log(xhr.responseText);
                    } else {
                        console.log('Request was unsuccessful: ' + xhr.status);
                    }
                }
            };
            xhr.open('get', '/user/info?name=hehe');
            xhr.setRequestHeader('MyHeader', 'MyValue');
            xhr.send();
        });

        newUserForm.addEventListener('submit', newUser);

        uploadUserInfoForm.addEventListener('submit', uploadUserInfo);
        getUserInfoBtn.addEventListener('click', function () {
            getUserInfo();
        });
        function newUser(e) {
            e.preventDefault();
            var data = {
                userName: newUserForm.userName.value,
                psw: newUserForm.psw
            };
            (0, _utli.ajax)({
                method: 'post',
                url: '/user/new',
                data: data
            }, function (res) {
                console.log(res);
            });
        }

        function uploadUserInfo(e) {
            e.preventDefault();
            (0, _utli.ajax)({
                method: 'post',
                url: 'uploadUserInfo',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    userInfo: uploadUserInfoForm.userInfo.files[0],
                    email: uploadUserInfoForm.email.value
                }
            }, function (res) {
                console.log(res);
            });
        }
        function getUserInfo() {
            (0, _utli.ajax)({
                method: 'get',
                url: '/user/info',
                data: {
                    pageNum: 1,
                    pageSize: 10
                }
            }, function (res) {
                console.log(res);
            });
        }
    }

    exports.bootstrap = bootstrap;
});