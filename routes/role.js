var express = require('express');
var router = express.Router();
var db = require('../public/javascripts/mysql.js');  
var throwErr = require('../public/javascripts/throwErr') 
/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body)
  count();
  function count(){
    let sqlonlycount = `select count(1) from  role where role_code = "${req.body.code}" or role_name = "${req.body.name}";`;
    db.query(sqlonlycount, function(err, results, fields){  
      if (err) {return throwErr(next,err)}
      if(results[0]['count(1)'] > 0){
         res.send({
           code: 'P001',
           msg:"role_code or role_name  已存在"
         });
      }else{
        return insert();
      }
    });  
  }
  function insert (){
  let sql = `insert into role values(0,"${req.body.name}" ,"${req.body.code}");`;  
    db.query(sql, function(err, results, fields){  
      if (err) {return throwErr(next,err)}
      console.log('results')
      console.log(results)
      if(req.body.permiss.length>0){
        insertRole_Permiss(results.insertId,req, res,next)
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
  var sql='';
  var sqlCount='';
  if(req.query.keyword){
    console.log(11111)
    sql= `select *  from role where role_code like "%${req.query.keyword}%" or role_name like "%${req.query.keyword}%"  limit ${(req.query.pageNo-1)*req.query.pageSize},${req.query.pageSize};`; 
    sqlCount = `select count(1)  from role where role_code like "%${req.query.keyword}%" or role_name like "%${req.query.keyword}%";`;  
  
  }else{
    sql= !req.query.pageNo?`select *  from role ;`:`select *  from role   limit ${(req.query.pageNo-1)*req.query.pageSize},${req.query.pageSize};`;  
    sqlCount = `select count(1) from role;` 
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
  console.log(req.params.id)
  // var sql= `select * from role WHERE id=`+req.params.id;  
  var sql=`SELECT role_id as id,
  role_code as code,
  role_name as name,
  GROUP_CONCAT('{"id":',permiss_id,',\"permiss_code\":\"',permiss_code,'\",\"permiss_name\":\"', permiss_name,'\"}') as permiss 
  FROM role r INNER  JOIN  role_permiss rp ON r.id = rp.role_id 
  INNER  JOIN permiss p  ON p.id = rp.permiss_id
  WHERE r.id=${req.params.id}
  `
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
    results[0].id = req.params.id
    results[0].permiss =JSON.parse("["+results[0].permiss+"]")
    res.send({
        code: 'S200',
        data:results
      });
  });
});
router.delete('/:id', function(req, res, next) {
  console.log(req.params.id)
  let sqlcount=`SELECT count(1)
  FROM user_role 
  WHERE role_id=${req.params.id};`;
  db.query(sqlcount, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
    if(results[0]['count(1)']>0){
        res.send({
          code: 'R001',
          msg:"不能删除此角色"
        });
    }else{
      deleteRole_Permiss(req,next)
      deleteRole(req,res,next)
    }
  });
});
router.put('/:id', function(req, res, next) {
  deleteRole_Permiss(req,next)
  var sql= `UPDATE role SET role_code="${req.body.code}", role_name="${req.body.name}" WHERE id=${req.params.id}`;  
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
    if(req.body.permiss&&req.body.permiss.length>0){
      insertRole_Permiss(null,req, res)
    }else{
      res.send({
        code: 'S200',
        msg:""
      });
    }
  });
  
});
function deleteRole(req,res,next){
  var sql= `DELETE FROM role WHERE id=${req.params.id}`;  
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
    res.send({
        code: 'S200',
        msg:""
      });
  });
}
// 删除角色关联的权限
function deleteRole_Permiss(req,next){
  var sql= `DELETE FROM role_permiss WHERE role_id=${req.params.id}`;  
  db.query(sql, function(err, results, fields){  
    if (err) {return throwErr(next,err)}
  })
}
// 关联角色&权限
function insertRole_Permiss(results,req,res, next){
  console.log(req.body.permiss)
  let sql = `insert into role_permiss (role_id,permiss_id) values`;  
  req.body.permiss.forEach(element => {
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
