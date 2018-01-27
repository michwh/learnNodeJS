1.Sequelize
ORM技术：Object-Relational Mapping，把关系数据库的表结构映射到对象上。例：

数据库中的一个 pets 表：

mysql> select * from pets;
+----+--------+------------+
| id | name   | birth      |
+----+--------+------------+
|  1 | Gaffey | 2007-07-07 |
|  2 | Odie   | 2008-08-08 |
+----+--------+------------+
2 rows in set (0.00 sec)


每一行可以用一个JavaScript对象表示，例如第一行：

{
    "id": 1,
    "name": "Gaffey",
    "birth": "2007-07-07"
}

Sequelize就是Node的ORM框架，用来操作数据库。这样，我们读写的都是JavaScript对象，Sequelize帮我们把对象变成数据库中的行。


2.使用Sequelize操作MySQL需要先做两件准备工作：

（1）创建一个sequelize对象实例：

const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

（2）定义模型Pet，告诉Sequelize如何映射数据库表：

var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
}, {
        timestamps: false
    });

用sequelize.define()定义Model时，传入名称pet，默认的表名就是pets。
第二个参数指定列名和数据类型，如果是主键，需要更详细地指定。
第三个参数是额外的配置，我们传入{ timestamps: false }是为了关闭Sequelize的自动添加timestamp的功能。

（3）接下来，我们就可以往数据库中塞一些数据了：

用await写：

(async () => {
    var dog = await Pet.create({
        id: 'd-' + now,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('created: ' + JSON.stringify(dog));
})();


3.使用Sequelize操作数据库的一般步骤就是：

（1）通过某个Model对象的 findAll()方法获取实例；

//查询数据时，用await写法如下：
(async () => {
    var pets = await Pet.findAll({
        where: {
            name: 'Gaffey'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
    }
})();

（2）如果要更新实例，先对实例属性赋新值，再调用 save()方法；

(async () => {
    var p = await queryFromSomewhere();
    p.gender = true;
    p.updatedAt = Date.now();
    p.version ++;
    await p.save();
})();

如果要删除实例，直接调用 destroy()方法：

(async () => {
    var p = await queryFromSomewhere();
    await p.destroy();
})();

注意 findAll()方法可以接收where、order这些参数，这和将要生成的SQL语句是对应的。