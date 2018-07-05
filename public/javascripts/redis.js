var redis = require("redis"), //召唤redis  
    /* 
        连接redis数据库，createClient(port,host,options); 
        如果REDIS在本机，端口又是默认，直接写createClient()即可 
        redis.createClient() = redis.createClient(6379, '127.0.0.1', {}) 
    */
    RDS_PORT = 6379, //端口号    
    RDS_HOST = '127.0.0.1', //服务器IP  要连接的A服务器redis    
    RDS_PWD = '123456', //密码    
    RDS_OPTS = {}, //设置项    
    redisClient = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
//如果需要验证，还要进行验证  
// client.auth(RDS_PWD,function(){    
//     console.log('通过认证');    
// }); 
redisClient.on('connect', function () {
    // console.log('connect');
});
// redisClient.on('ready',function(err){    
//     console.log('ready');    
// })

// // if you'd like to select database 3, instead of 0 (default), call  
// // redisClient.select(3, function() { /* ... */ });  

// //错误监听？  
// redisClient.on("error", function (err) {  
//     console.log("Error " + err);  
// });  

// redisClient.set("string key", "string val", redis.print);//set "string key" "string val"  

// /*两种都可以断掉与redis的连接， 
// end()很粗暴，不管3721，一下子退出来了，上面那句获取哈希表"hash key"的某个元素值的表达式将没有结果返回 
// 而quit()则是先将语句处理完毕再干净地退出，斯文得很 
// */  
// //redisClient.end();  
// redisClient.quit();  
// });  

exports.redisClient = redisClient;
exports.redis = redis;