var fs= require('fs')
fs.stat('./test.txt',  (err, filename) => {
  if (filename) {
    console.log(filename);
  }
});
fs.access('./test.txt', fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK, (err) => {
  console.log(err ? 'no access!' : 'can Find/read/write');
});

// fs.open('myfile', 'rw', (err, fd) => {
//   if (err) {
//     if (err.code === 'ENOENT') {
//       console.error('myfile does not exist');
//       return;
//     }

//     throw err;
//   }

//   // readMyData(fd);
//   // writeMyData(fd);
// });
fs.appendFile('./test.txt','data to append',(err)=>{
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
})

fs.open('./test.txt', 'a', (err, fd) => {
  if (err) throw err;
  fs.appendFile(fd, 'data to append', 'utf8', (err) => {
    fs.close(fd, (err) => {
      if (err) throw err;
    });
    if (err) throw err;
  });
});

// 默认情况下，destination.txt 将创建或覆盖
fs.copyFile('test.txt', 'destination.txt', (err) => {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
});