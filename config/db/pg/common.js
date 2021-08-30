import db from "./pool.js"

export default class common {
  /**
   * 根据传入参数名 和 参数值动态搜索
   * @param tableName 查询表的表名
   * @param columnValue 查询表的列参数
   * @param sqlWord 动态SQL语句参数词
   * @param values 动态参数值
   * 例: tableName = files,
   *     columnValue = '*'
   *     sqlWord = "user_id = $1"
   *     values = [user_id]
   */
  static GetFuncBySqlWord (tableName, columnValue, sqlWord, values) {
    let sql
    if (sqlWord === '') {
      sql = `select ${columnValue} from ${tableName}`
    } else {
      sql = `select ${columnValue} from ${tableName} where ${sqlWord}`
    }
    return new Promise((resolve, reject) => {
      db.connect().then(client => {
        client.query(sql, values).then(res => {
          if (res.rowCount != 0) {
            resolve(res.rows)
          } else {
            resolve()
          }
          client.release()
        }).catch(err => {
          client.release()
          console.log(err.stack)
          reject();
        })
      })
    })
  }

  /**
   * tables列搜索
   * @param tableName 查询表的表名
   * @param columnValue 查询表的列参数
   * @param sqlWord 动态SQL语句参数词
   * @param values 动态参数值
   * 例: tableName = files,
   *     columnValue = '*'
   *     sqlWord = "user_id = $1"
   *     page = 1
   *     size = 10
   *     target = time
   *     rank = desc
   *     values = [user_id]
   */
  static GetFuncCountAndAllBySqlWord (tableName, columnValue, sqlWord, page, size, target, rank, values) {
    let limit = size
    let pageNumber = (page - 1) === 0 ? 0 : page - 1
    let offset = size * pageNumber;
    let countSql
    let sql
    if (sqlWord === '') {
      countSql = `select count(*) from ${tableName}`
      sql = `select ${columnValue} from ${tableName} ORDER BY ${target} ${rank} limit ${limit} offset ${offset}`
    } else {
      countSql = `select count(*) from ${tableName} where ${sqlWord}`
      sql = `select ${columnValue} from ${tableName} where ${sqlWord} ORDER BY ${target} ${rank} limit ${limit} offset ${offset}`
    }
    let callback = new Object();
    return new Promise((resolve, reject) => {
      db.connect().then(client => {
        client.query(countSql, values).then(res => {
          if (res.rowCount != 0) {
            callback.total = res.rows[0].count
            client.query(sql, values).then(res => {
              callback.info = res.rows
              resolve(callback)
              client.release()
            }).catch(err => {
              client.release()
              console.log(err.stack)
              reject();
            })
          } else {
            client.release()
            resolve()
          }
        }).catch(err => {
          client.release()
          console.log(err.stack)
          reject();
        })
      })
    })
  }

  /**
   * 获取数据列count
   * @param tableName 查询表的表名
   * @param sqlWord 动态SQL语句参数词
   * @param values 动态参数值
   * 例: tableName = files,
   *     sqlWord = "user_id = $1"
   *     values = [user_id]
   */
  static GetFuncTableCountBySqlWord (tableName, sqlWord, values) {
    let countSql
    if (sqlWord === '') {
      countSql = `select count(*) from ${tableName}`
    } else {
      countSql = `select count(*) from ${tableName} where ${sqlWord}`
    }
    return new Promise((resolve, reject) => {
      db.connect().then(client => {
        client.query(countSql, values).then(res => {
          if (res.rowCount != 0) {
            resolve(res.rows[0].count)
            client.release()
          } else {
            client.release()
            resolve()
          }
        }).catch(err => {
          client.release()
          console.log(err.stack)
          reject();
        })
      })
    })
  }

  /**
   * 根据传入参数名 和 参数值动态更新表数据
   * @param tableName 查询表的表名
   * @param QueryValue 查询条件
   * @param InsertValue 插入值
   * @param values 动态参数值
   * 例: tableName = files,
   *     QueryValue = 'file_id = $1'
   *     InsertValue = "txt_tip = $2"
   *     values = [file_id,txt_tip]
   */
  static UpdateFuncBySqlWord (tableName, QueryValue, InsertValue, values) {
    let sqlWord = `UPDATE ${tableName} set ${InsertValue} where ${QueryValue}`
    return new Promise((resolve, reject) => {
      db.connect().then(client => {
        client.query(sqlWord, values).then(res => {
          if (res.rowCount > 0) {
            resolve("success...")
          } else {
            reject();
          }
          client.release()
        }).catch(error => {
          client.release()
          console.log(error, '插入表失败')
          reject(error);
        })
      })
    })
  }

  /**
   * 根据传入参数名 和 参数值动态更新表数据
   * @param tableName 查询表的表名
   * @param QueryValue 查询条件
   * @param values 动态参数值
   * 例: tableName = files,
   *     QueryValue = 'file_id = $1'
   *     values = [file_id,txt_tip]
   */
  static DeleteFuncBySqlWord (tableName, QueryValue, values) {
    let sqlWord = `delete from ${tableName} where ${QueryValue}`
    return new Promise((resolve, reject) => {
      db.connect().then(client => {
        client.query(sqlWord, values).then(res => {
          if (res.rowCount > 0) {
            resolve("success...")
          } else {
            reject();
          }
          client.release()
        }).catch(error => {
          client.release()
          console.log(error, '插入表失败')
          reject(error);
        })
      })
    })
  }

  /**
   * 根据传入参数名 和 参数新增表数据
   * @param tableName 查询表的表名
   * @param addValue 查询条件
   * @param values 动态参数值
   * 例: tableName = files,
   *     QueryValue = ['id','name']
   *     values = [file_id,txt_tip]
   */
  static AddFuncBySqlWord (tableName, addValue, values) {
    let num = [];
    for (let i = 1; i <= addValue.length; i++) {
      num.push("$" + i);
    }
    const $number = num.join(',')
    let sqlWord = `insert into ${tableName}(${addValue})values(${$number})`
    return new Promise((resolve, reject) => {
      db.connect().then(client => {
        client.query(sqlWord, values).then(res => {
          if (res.rowCount > 0) {
            resolve("success...")
          } else {
            reject();
          }
          client.release()
        }).catch(error => {
          client.release()
          console.log(error, '插入表失败')
          reject(error);
        })
      })
    })
  }
}