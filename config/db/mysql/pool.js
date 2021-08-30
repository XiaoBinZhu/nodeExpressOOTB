import mysql from 'mysql'
const mysqlConfig = global.config.sql.mysql;

const pool = mysql.createPool(mysqlConfig)

export default (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (err.errno == 'ECONNREFUSED') {
          console.log('连接数据库失败，请确认您的MySQl服务是否已启动'.red)
        } else {
          reject(err);
        }
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            if (err.errno == 1055) {
              console.log('查询数据库失败')
            } else {
              reject(err);
            }
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}