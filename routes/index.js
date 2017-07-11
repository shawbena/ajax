var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/user/info', function(req, res, next){
  // res.send('haha');
});
//新建用户
router.post('/user/new', function(req, res, next){
  res.send({
    record: 1200,
    msg: '成功',
    data: {
    }
  });
});
//上传用户信息
router.post('/user/info/upload', function(req, res, next){
  // res.send({
  //   record: 1200,
  //   msg: '成功',
  //   data: {

  //   }
  // });
});

module.exports = router;
