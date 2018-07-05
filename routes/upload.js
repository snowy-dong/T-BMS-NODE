var express = require('express');
var router = express.Router();
var db = require('../public/javascripts/mysql');  
/* GET home page. */

router.post('/', function(req, res, next) {
  res.send({
    code: 'S200',
    msg: 'reply',
    data:req.body,
    file:req.files
  });
});

module.exports = router;

