1.创建koa2工程

// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    await next();
    // 设置response的Content-Type:
    ctx.response.type = 'text/html';
    // 设置response的内容:
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');

其中，参数ctx是由koa传入的封装了request和response的变量，我们可以通过它访问request和response，next是koa传入的将要处理的下一个异步函数。

上面的异步函数中，我们首先用await next();处理下一个异步函数，然后，设置response的Content-Type和内容。

由async标记的函数称为异步函数，在异步函数中，可以用await调用另一个异步函数，这两个关键字将在ES7中引入。

1.1koa包安装

（1）node的版本要>=7.6//由于node不支持win，所以在win上更新node要去官网下载最新版本
（2）在项目目录下创建一个 package.json，这个文件描述了我们的项目会用到哪些包

完整的文件内容如下：

{
    "name": "hello-koa2",
    "version": "1.0.0",
    "description": "Hello Koa 2 example with async",
    "main": "app.js",
    "scripts": {
        "start": "node app.js"
    },
    "keywords": [
        "koa",
        "async"
    ],
    "author": "Michael Liao",
    "license": "Apache-2.0",
    "repository": {
        "type": "git",
        "url": "https://github.com/michaelliao/learn-javascript.git"
    },
    "dependencies": {//dependencies描述了我们的工程依赖的包以及版本号
        "koa": "2.0.0"
    }
}

（3）在项目目录下，在node控制台中执行npm install//此举是安装项目所需的包
（4）执行项目，在浏览器中打开 localhost:3000。可以用node app.js执行或用npm start

2.koa middleware

koa的核心代码是：

app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});

每收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx和next参数。

koa把很多async函数组成一个处理链，每个async函数可以做一些自己的事情，然后用 await next()来调用下一个async函数
我们把每个async函数称为middleware（中间件），这些middleware可以组合起来，完成很多功能
例如：

app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
});

app.use(async (ctx, next) => {
    const start = new Date().getTime(); // 当前时间
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`Time: ${ms}ms`); // 打印耗费时间
});

app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});

调用app.use()的顺序决定了middleware的顺序。
如果一个middleware没有调用await next()，后续的middleware将不再执行了。
例如，一个检测用户权限的middleware可以决定是否继续处理请求，还是直接返回403错误：

app.use(async (ctx, next) => {
    if (await checkUserPermission(ctx)) {
        await next();
    } else {
        ctx.response.status = 403;
    }
});

最后注意ctx对象有一些简写的方法，例如 ctx.url相当于ctx.request.url，ctx.type相当于ctx.response.type。

2.1koa-router

根据不同的URL调用不同的处理函数

2.1.1安装步骤
（1）在 package.json中添加依赖：
"koa-router": "7.0.0"
（2）然后npm install安装

2.1.2运用

使用koa-router前的步骤：
（1）引入koa
const Koa = require('koa');
（2）创建一个koa对象
const app = new Koa();
（3）引入koa-router
const router = require('koa-router')();//此处有两个()
（4）在koa对象中注册koa-router
app.use(router.routes());


2.1.2.1get请求

const Koa = require('koa');
const app = new Koa();
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();//此处有两个()
// add router middleware:
app.use(router.routes());
// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
// add url-route:
router.get('/hello/:name', async (ctx, next) => {//可以在请求路径中使用带变量的/hello/:name，变量可以通过ctx.params.name访问
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});
router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>';
});

app.listen(3000);//给app设置监听端口
console.log('app started at port 3000...');


2.1.2.2post请求

const Koa = require('koa');
const app = new Koa();
const bodyParser=require('koa-bodyparser');//由于middleware的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上。
app.use(bodyParser());
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
app.use(router.routes());

router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', async (ctx, next) => {
    var
        name = ctx.request.body.name || '',//如果该字段不存在，默认值设置为''
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

app.listen(3000);
console.log('app started at port 3000...');

2.1.3用模块化的方式处理URL
参考 koa模块化 文件夹

