import { createXHR, querySelector, ajax } from 'utli';

function bootstrap() {
    let userInfoBtn = querySelector('#user_info_btn');
    let newUserForm = querySelector('#new_user_form');
    let uploadUserInfoForm = querySelector('#upload_user_info');
    let getUserInfoBtn = querySelector('#get_user_info');
    userInfoBtn.addEventListener('click', function () {
        let xhr = createXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    console.log(xhr.responseText);
                } else {
                    console.log('Request was unsuccessful: ' + xhr.status);
                }
            }
        }
        xhr.open('get', '/user/info?name=hehe');
        xhr.setRequestHeader('MyHeader', 'MyValue');
        xhr.send();
    });
    
    //新建用户
    newUserForm.addEventListener('submit', newUser);
    //上传用户信息
    uploadUserInfoForm.addEventListener('submit', uploadUserInfo);
    getUserInfoBtn.addEventListener('click', function(){
        getUserInfo();
    });
    function newUser(e) {
        e.preventDefault();
        let data = {
            userName: newUserForm.userName.value,
            psw: newUserForm.psw
        };
        ajax({
            method: 'post',
            url: '/user/new',
            data
        }, function(res){
            console.log(res);
        });
    }

    function uploadUserInfo(e){
        e.preventDefault();
        ajax({
            method: 'post',
            url: 'uploadUserInfo',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                userInfo: uploadUserInfoForm.userInfo.files[0],
                email: uploadUserInfoForm.email.value
            }
        }, (res) => {
            console.log(res);
        });
    }
    function getUserInfo(){
        ajax({
            method: 'get',
            url: '/user/info',
            data: {
                pageNum: 1,
                pageSize: 10
            }
        }, (res) => {
            console.log(res);
        });
    }

}

export { bootstrap };