1.异步读取文件

'use strict';
var fs=require('fs');
fs.readFile('文件名','utf-8',function(err,data){//文件名要在当前目录下
    if(err){
    	console.log(err);
    } else {
    	console.log(data);
    }
});

当读取二进制文件时，不传入文件编码时，回调函数的data参数将返回一个Buffer对象
Buffer对象可以和String做转换

(1)Buffer->String

var text=data.toString('utf-8');
console.log(text);

(2)String->Buffer

var buf=Buffer.from(text,'utf-8');
console.log(buf);


2.同步读文件

var fs=require('fs');
var data=fs.readFileSync('文件名','utf-8');
console.log(data);

用 try...catch 捕获错误

try{
	var fs=require('fs');
    var data=fs.readFileSync('文件名','utf-8');
    console.log(data);
} catch(err){

}


3.写文件

var fs=require('fs');
var data='abcdefg';
fs.writeFile('文件名',data,function(err){
	if(err){
		console.log(err);
	} else {
		console.log('ok');
	}
});


4.同步写文件方法

fs.writeFileSync('文件名',data);


5.stat

fs.stat()返回一个对象，告诉我们文件或目录的详细信息

'use strict';
var fs = require('fs');
fs.stat('sample.txt', function (err, stat) {
    if (err) {
        console.log(err);
    } else {
        // 是否是文件:
        console.log('isFile: ' + stat.isFile());
        // 是否是目录:
        console.log('isDirectory: ' + stat.isDirectory());
        if (stat.isFile()) {
            // 文件大小:
            console.log('size: ' + stat.size);
            // 创建时间, Date对象:
            console.log('birth time: ' + stat.birthtime);
            // 修改时间, Date对象:
            console.log('modified time: ' + stat.mtime);
        }
    }
});

执行结果如下：

isFile: true
isDirectory: false
size: 181
birth time: Fri Dec 11 2015 09:43:41 GMT+0800 (CST)
modified time: Fri Dec 11 2015 12:09:00 GMT+0800 (CST)

stat()也有一个对应的同步函数 statSync()


6.同步还是异步

因为JavaScript只有一个线程，必须使用异步
服务器启动时如果需要读取配置文件，或者结束时需要写入到状态文件时，可以使用同步代码，因为这些代码只在启动和结束时执行一次，不影响服务器正常运行时的异步执行。


