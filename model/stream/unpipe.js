const assert = require('assert');
var fs= require('fs')
var reader =  fs.createReadStream('test.txt', { start: 0, end: 999 });
var writer =  fs.createWriteStream('sample1.txt');
writer.on('unpipe', (src) => {
  console.error('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
writer.on('pipe', (src) => {
  console.error('something is piping into the writer');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);