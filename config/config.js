import path from "path";
const config = {
  developement: {
    sql: {
      pgsql: {
        host: "127.0.0.1",
        port: 5432,
        user: "root",
        password: "123456",
        database: "db",
        max: 10,
        idleTimeoutMillis: 30000
      },
      mysql: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'db'
      },
      mongo: {
        host: '127.0.0.1',
        port: 27017,
        user: 'root',
        password: '123456',
        database: 'db',
      }
    },
    redis: {
      host: "127.0.0.1",
      port: 6379
    },
    cryptoJS: {
      // 16 digits keyStr,
      keyStr: "123456789aBcDeFg"
    },
    jwt: {
      // Token secret key
      keyStr: "123456789aBcDeFg"
    },
    amqp: {
      url: "amqp://127.0.0.1:5672"
    },
    email: {
      host: "smtp.126.com",
      secureConnection: true,
      port: 465,
      secure: true,
      tls: {
        rejectUnauthorized: false
      },
      user: "thepowerofmilk@126.com",
      pass: "123456",
      replyTo: "thepowerofmilk@126.com",
      content: {
        value: "",
        title: ""
      }
    },
    phone: {
      content: {
        value: ""
      }
    }
  }
}
const env = process.env.NODE_ENV || 'developement'
console.log(env);
global.config = config[env];

const __dirname = path.resolve(path.dirname(''));
global.rootPath = __dirname;