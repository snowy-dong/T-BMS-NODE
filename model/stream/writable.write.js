// writable.write
var fs= require('fs')
const file = fs.createWriteStream('example.txt');
function write(data, cb) {
  if (!file.write(data)) {
    file.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// 在回调函数被执行后再进行其他的写入
write('hello', () => {
  console.log('write completed, do more writes now');
}