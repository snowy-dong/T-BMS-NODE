var express = require('express');
var router = express.Router();
var db = require('../public/javascripts/mysql.js');  
var throwErr = require('../public/javascripts/throwErr')

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body)
  count();
  function count(){
    let sqlonlycount = `select count(1) from  user where user_name = "${req.body.name}";`;
    db.query(sqlonlycount, function(err, results, fields){  
     if (err) {return throwErr(next,err)}
      console.log(results[0]['count(1)'])
      if(results[0]['count(1)'] > 0){
         res.send({
           code: 'U001',
           msg:"user_name  已存在"
         });
      }else{
        return insert();
      }
    });  
  }
  function insert (){
  let sql = `insert into user values(0,"${req.body.name}",123456,"${req.body.email}","${req.body.cellphone}","${req.body.joinDate}",Null ,"${req.body.gender}");`;  
    db.query(sql, function(err, results, fields){  
     if (err) {return throwErr(next,err)}
      if(req.body.role.length>0){
        insertUser_Role(results.insertId, req, res)
      }else{
        res.send({
          code: 'S200',
          msg:""
        });
      }
    });
  }

});
router.get('/list', function(req, res, next) {
  console.log('worker'+cluster.worker.id);
  process.send(`[worker]   worker${cluster.worker.id} received!`);
  var sql='';
  var sqlCount='';
  if(req.query.keyword){
    sql= `select id,user_name,email,cell_phone,join_date,leave_date,gender from user where user_name like "%${req.query.keyword}%"  limit ${(req.query.pageNo-1)*req.query.pageSize},${req.query.pageSize};`; 
    sqlCount = `select count(1)  from user where user_name like "%` + req.query.keyword + `%";`;  
  
  }else{
    sql= `select id,user_name,email,cell_phone,join_date,leave_date,gender  from user   limit ${(req.query.pageNo-1)*req.query.pageSize},${req.query.pageSize};`;  
    sqlCount = `select count(1) from user;` 
  }
  let data ={
    count:0,
    list:[]
  }
  count();
  function count(){
    db.query(sqlCount, function(err, results, fields){  
     if (err) {return throwErr(next,err)}
      data.count = results[0]['count(1)']
      page();
    });
  }
  function page(){
    db.query(sql, function(err, results, fields){  
     if (err) {return throwErr(next,err)}
      data.list = results
      res.send(data);
    });
  }
});
router.get('/:id', function(req, res, next) {
  // var sql= `select id,user_name,email,cell_phone,join_date,leave_date,gender from user WHERE id=`+req.params.id;  
  var sql=`SELECT 
  user_name as name,
  email,
  cell_phone as cellphone,
  join_date as joinDate,
  leave_date as leaveDate,
  gender,
  GROUP_CONCAT('{"id":',role_id,',\"role_code\":\"',role_code,'\",\"role_name\":\"', role_name,'\"}') as role 
  FROM user u INNER  JOIN  user_role ur ON u.id = ur.user_id 
  INNER  JOIN role r  ON r.id = ur.role_id
  WHERE u.id=${req.params.id}
  `
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
    results[0].id = req.params.id
    results[0].role =JSON.parse("["+results[0].role+"]")
    res.send({
        code: 'S200',
        data:results
      });
  });
});
router.delete('/:id', function(req, res, next) {
  console.log(req.params.id)
  deleteUser_Role(req,next)
  
  var sql= `DELETE FROM user WHERE id=${req.params.id}`;  
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
    res.send({
      code: 'S200',
      msg:""
    });
  });
});
router.put('/:id', function(req, res, next) {
  console.log(req.params.id)
  deleteUser_Role(req, next)
  var sql= `UPDATE user SET  
  user_name="${req.body.name}",
  email = "${req.body.email}",
  cell_phone = "${req.body.cellphone}",
  join_date = "${req.body.joinDate}",
  gender = "${req.body.gender}" 
  WHERE id=${req.params.id};`;  
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
    if(req.body.role&&req.body.role.length>0){
      insertUser_Role(null,req, res, next)
    }else{
      res.send({
        code: 'S200',
        msg:""
      });
    }
  });
});
// 删除用户关联的角色
function deleteUser_Role(req, next){
  var sql= `DELETE FROM user_role WHERE user_id=${req.params.id}`;  
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
  })
}
// 关联用户&角色
function insertUser_Role(results,req, res, next){
  console.log(req.body.role)
  let sql = `insert into user_role (user_id, role_id) values `;  
  req.body.role.forEach(element => {
    sql+= `(${results | req.params.id}, ${element}),`;  
  
  });
  sql = sql.substr(0, sql.length - 1) + ';';
  console.log(sql)
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
    console.log(results)
    res.send({
      code: 'S200',
      msg:""
    });
  });
}
module.exports = router;
