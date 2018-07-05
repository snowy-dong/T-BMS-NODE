var fs= require('fs')
var createReadStream =  fs.createReadStream('test.txt', { start: 0, end: 999 });
var createWriteStream =  fs.createWriteStream('sample1.txt');
// createReadStream.pipe(createWriteStream)
fs.writeFile('sample1.txt', 'Hello Node.js', (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});