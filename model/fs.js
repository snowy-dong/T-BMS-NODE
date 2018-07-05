const fs = require('fs');

const rs = fs.createReadStream('../uploads/test.txt');
var chunkArr = [],
    chunkLen = 0;
rs.on('data',(chunk)=>{
    chunkArr.push(chunk);
    chunkLen+=chunk.length;
});
rs.on('end',(chunk)=>{
    console.log(Buffer.concat(chunkArr,chunkLen).toString());
});