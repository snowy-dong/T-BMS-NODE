var  cp = require('child_process')
process.on('msg',function(m){
  console.log(m)
})
process.send({"message":"hello I am child"})