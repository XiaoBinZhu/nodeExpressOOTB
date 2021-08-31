# nodeExpressOOTB

> yarn install
>
> yarn start
>
> yarn dev // 开发模式
>
> yarn pm2 // 持久化

##### Contact himselfDonation

QQ 群：720013824

##### 所需使用环境

sql, casbin, rabbitmq, redis, pm2 `<v5.0>`

使用前需要修改 config/config.js 文件

1.sql

config/db 文件夹里面有 3 个基本数据库配置 其中 pgsql 可作为参照模板 mongodb/mysql/pgsql

pgsql 使用方式:

> `import dbCommon from "./config/db/common.js";`
>
> `dbCommon.GetFuncBySqlWord('user',id,'id = $1',['id'])`

2. [casbin](https://github.com/casbin/node-casbin) [TypeORMAdapter](https://github.com/node-casbin/typeorm-adapter)

使用前需要仔细查看 casbin 文档

注 `TypeORMAdapter` 需要自行切换当先使用数据库 本项目代码默认使用 pgsql

使用方式:

> `casbin.addPolicy('name','router','GET || POST')`

3.rabbitmq

使用方式:

> `import boker from "./config/rabbitmq/broker.js";`
>
> `broker.pushContent({ phone, code: data }, 'verification');`

其他我就不多赘述了 都在代码里面 自己看
