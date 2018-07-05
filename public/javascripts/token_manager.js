var redisClient = require('./redis').redisClient;
var TOKEN_EXPIRATION = 360000;
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 360000;
var jwt = require('jsonwebtoken');
var secret = require('./secret');
// Middleware for token verification
exports.verifyToken = function (req, res, next) {
  var token = getToken(req.headers);
 jwt.verify(token, secret.secretToken, {
    expiresIn: TOKEN_EXPIRATION_SEC
  }, function(err, decoded){
    if(err){
      res.send({
        code: 'S401',
        msg: 'reply',
      });
    }
    if(decoded && decoded.name ){
       getName(decoded.name)
    }
  })
  function getName(name){
    redisClient.get(name, function (redisRes, reply) {
      // console.log(reply)
      if (reply === token) {
        next()
      } else {
        return res.send({
          code: 'S401',
          msg: 'reply',
        });
      }
    });
  }
};

exports.expireToken = function (headers) {
  var token = getToken(headers);

  if (token != null) {
    redisClient.set(token, {
      is_expired: true
    }); 
    redisClient.expire(token, TOKEN_EXPIRATION_SEC);
  }
};

var getToken = function (headers) {
  if (headers && headers.authorization) {
    var authorization = headers.authorization;
    return authorization;
  } else {
    return null;
  }
};

exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;