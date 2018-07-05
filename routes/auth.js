var express = require('express');
var router = express.Router();
var db = require('../public/javascripts/mysql.js');
var redisClient = require('../public/javascripts/redis.js').redisClient;
var jwt = require('jsonwebtoken');
var secret = require('../public/javascripts/secret');
var tokenManager = require('../public/javascripts/token_manager');


/* GET users listing. */
router.post('/', function (req, res, next) {

  get();
  function get() {
    redisClient.get(req.body.name, function (redisRes, reply) {
      // console.log(reply)
      if (reply) {
        res.send({
          code: 'S200',
          msg: 'reply' + reply,
          data:reply
        });
      } else {
        count()
      }
    });
  }

  function set(code) {
    redisClient.set(req.body.name, code, function (redisRes, reply) {
      if (reply) {
        redisClient.expire(req.body.name, tokenManager.TOKEN_EXPIRATION);
        res.send({
          code: 'S200',
          msg: '登录成功',
          data:code
        });
      }
    });
  }

  function count() {
    let sqlonlycount = `select count(1) from  user where user_name = "` + req.body.name + `" and password = "` + req.body.password + `";`;
    db.query(sqlonlycount, function (err, results, fields) {
      if (err) throw err;
      if (results[0]['count(1)'] > 0) {
        var token = jwt.sign({
          name: req.body.name
        }, secret.secretToken, {
          expiresIn: tokenManager.TOKEN_EXPIRATION_SEC
        });
        return set(token)
      } else {
        res.send({
          code: 'S401',
          msg: '账号或密码错误！'
        });
      }
    });
  }

});

module.exports = router;