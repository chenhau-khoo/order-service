const SnakeNamingStrategy = require('typeorm-naming-strategies')
    .SnakeNamingStrategy;


module.exports = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'orderDB',
    entities: [
        "dist/**/**.entity{.ts,.js}"
    ],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy()
}