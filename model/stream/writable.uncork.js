// writable.uncork
var fs= require('fs')
const file = fs.createWriteStream('example.txt');
file.cork();
file.write('some ');
file.write('data ');
process.nextTick(() => file.uncork());

// 如果一个流多次调用了 writable.cork() 方法，那么也必须调用同样次数的 writable.uncork() 方法以输出缓冲区数据。

// stream.cork();
// stream.write('some ');
// stream.cork();
// stream.write('data ');
// process.nextTick(() => {
//   stream.uncork();
//   // 之前的数据只有在 uncork() 被二次调用后才会输出
//   stream.uncork();
// });