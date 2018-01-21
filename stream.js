流是一个对象。
data事件表示流的数据已经可以读取了，end事件表示这个流已经到末尾了，没有数据可以读取了，error事件表示出错了。


一个从文件流读取文本内容的示例：
'use strict';
var fs = require('fs');
// 打开一个流:
var rs = fs.createReadStream('sample.txt', 'utf-8');
rs.on('data', function (chunk) {
    console.log('DATA:')
    console.log(chunk);
});
rs.on('end', function () {
    console.log('END');
});
rs.on('error', function (err) {
    console.log('ERROR: ' + err);
});
data事件可能会有多次，每次传递的chunk是流的一部分数据


要以流的形式写入文件，只需要不断调用 write()方法，最后以 end()结束：

'use strict';

var fs = require('fs');

var ws1 = fs.createWriteStream('./test.txt', 'utf-8');
ws1.write('使用Stream写入文本数据...\n');
ws1.write('END.');
ws1.end();

var ws2 = fs.createWriteStream('./test2.txt');
ws2.write(new Buffer('使用Stream写入二进制数据...\n', 'utf-8'));
ws2.write(new Buffer('END.', 'utf-8'));
ws2.end();

上面两种写法会覆盖掉文本原来的内容


所有可以读取数据的流都继承自 stream.Readable，所有可以写入的流都继承自 stream.Writable。


2.pipe

一个Readable流和一个Writable流串起来后，所有的数据自动从Readable流进入Writable流，这种操作叫pipe。
通过Readable流的 pipe()方法实现

用 pipe()把一个文件流和另一个文件流串起来，这样源文件的所有数据就自动写入到目标文件里了，这实际上是一个复制文件的程序：

'use strict';

var fs = require('fs');

var rs = fs.createReadStream('./test.txt');
var ws = fs.createWriteStream('./test2.txt');

rs.pipe(ws);//把test.txt的内容复制到test2.txt。这种方法会覆盖掉test2.txt原来的内容

默认情况下，当Readable流的数据读取完毕，end事件触发后，将自动关闭Writable流。
如果我们不希望自动关闭Writable流，需要传入参数：

readable.pipe(writable, { end: false });