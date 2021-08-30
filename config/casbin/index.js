import path from "path";
import { newEnforcer } from "casbin";
import TypeORMAdapter from 'typeorm-adapter';
const authz_model = path.join(global.rootPath, '/config/casbin/data/authz_model.conf');
const pgsql = global.config.sql.pgsql;
/**
 * 向存储器添加了一条策略规则。
 * casbin.addPolicy('name','router','GET || POST')
 * 从存储器中移除一条策略规则。
 * casbin.RemovePolicy()
 * 从存储器中移除可匹配过滤器的策略规则。
 * casbin.RemoveFilteredPolicy(0,'router')
 */
TypeORMAdapter.default.newAdapter({
  type: "postgres",
  username: pgsql.user,
  password: pgsql.password,
  host: pgsql.host,
  database: pgsql.database,
  port: pgsql.port,
}).then(async a => {
  global.config.casbin = await newEnforcer(authz_model, a);
  console.log('casbin success set global');
}).catch(err => {
  console.log('casbin error set global', err);
})