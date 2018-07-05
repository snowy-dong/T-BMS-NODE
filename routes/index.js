var express = require('express');
var router = express.Router();
var db = require('../public/javascripts/mysql');  
/* GET home page. */

router.get('/', function(req, res, next) {
  var sql = 'SELECT 1 + 1 AS solution';  
  db.query(sql, function(err, results, fields){  
    if (err) throw err;
    // console.log('The solution is: ', results[0].solution);
    res.send('The solution is: '+ results[0].solution);
  });  
});

module.exports = router;

