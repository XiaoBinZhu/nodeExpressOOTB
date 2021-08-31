import path from "path";
import fs from "fs";
import { Readable } from "stream";
import jwt from "jsonwebtoken";
import redis from "redis";
import dbCommon from "../config/db/pg/common.js";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import broker from "../config/rabbitmq/broker.js";
import crypto from "crypto-js";
const uploadPath = path.join(global.rootPath, '/uploads');
const RedisClient = redis.createClient(global.config.redis);
// 启动 rabbitmq
broker.start();

RedisClient.on("error", function (error) {
  console.error(error);
});


/**
 * 全局公共res返回方法
 * @param {res} 接口请求的res
 * @param {code} 返回状态码
 * @param {response} 返回参数
 */
export const resStatusCallback = (res, code, response) => {
  response.code = code;
  res.status(code).send(response)
};

export const responseDefault = () => {
  let response = {
    code: Number(),
    message: '',
    data: {}
  }
  return response
}

// 不需要token就能请求的接口
export const whiteList = [
  '/user/changeUserInfoVerify',
  '/user/changeUserInfo',
  '/user/getEncryptPass',
  '/user/login',
  '/user/logout',
  '/user/register',
  '/user/sms'
]

export const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

export const bufferToStream = (binary) => {
  const readableInstanceStream = new Readable({
    read () {
      this.push(binary);
      this.push(null);
    }
  });
  return readableInstanceStream;
}

export function DeleteDirectory (dir) {
  if (fs.existsSync(dir) == true) {
    var files = fs.readdirSync(dir);
    files.forEach(function (item) {
      var item_path = path.join(dir, item);
      // console.log(item_path);
      if (fs.statSync(item_path).isDirectory()) {
        DeleteDirectory(item_path);
      }
      else {
        fs.unlinkSync(item_path);
      }
    });
    fs.rmdirSync(dir);
  }
}

/**
 * CryptoJS 密码加解密
 * @keyStr  为加密密钥 需要16位字符串
 * @param   encrypt 密码加密
 * @param   decrypt 密码解密
 * @return  CryptoJS加密后的密码
 */
export function CryptoJS () {
  const keyStr = global.config.cryptoJS.keyStr
  const aesUtil = {
    // 加密函數
    encrypt: (word) => {
      if (word === undefined) { return }
      if (word instanceof Object) {
        // JSON.stringify
        word = JSON.stringify(word)
      }
      const key = crypto.enc.Utf8.parse(keyStr)
      const encryptedObj = crypto.AES.encrypt(crypto.enc.Utf8.parse(word), key,
        {
          mode: crypto.mode.ECB,
          padding: crypto.pad.Pkcs7
        }
      )
      return encryptedObj.toString()
    },
    // 解密函數
    decrypt: (word) => {
      if (word === undefined) { return }
      const key = crypto.enc.Utf8.parse(keyStr)
      const decrypt = crypto.AES.decrypt(word, key,
        {
          mode: crypto.mode.ECB,
          padding: crypto.pad.Pkcs7
        }
      )
      const decString = crypto.enc.Utf8.stringify(decrypt).toString()
      return decString
    }
  }
  return aesUtil
}
/**
 * 生成随机数验证码
 * @return  6位数数字验证码
 */
export function createCode () {
  return Math.random().toString(10).substring(2, 5) + Math.random().toString(10).substring(8, 11);
}

/**
 * @function
 * @RenameFile
 */
export function RenameFile (oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.log(err);
        return reject(null);
      }
      let txtTip = fs.readFileSync(newPath).toString().split('\r\n')
      resolve(txtTip);
    });
  });
}

/**
 * @function
 * redis 写入
 */
export function writeRedis (key, value, exprires) {
  RedisClient.set(key, value)
  if (exprires) {
    RedisClient.expire(key, exprires);
  }
}


/**
 * @function
 * token 验证
 */
export function jwtVerify (token) {
  return new Promise((resolve, reject) => {
    RedisClient.get(token, function (err, reply) {
      if (reply) {
        jwt.verify(token, global.config.jwt.keyStr, (error, result) => {
          if (result) {
            resolve(result)
          } else {
            reject()
          }
        })
      } else {
        reject()
      }
    })
  })
}

// 加密方法
export function toEncryptCode (str) {
  var key = "0123456789ABCDEFGQIJKLMNOPQRSTEVWXYZ";
  var l = key.length;
  var a = key.split("");
  var s = "", b, b1, b2, b3;
  for (var i = 0; i < str.length; i++) {
    b = str.charCodeAt(i);
    b1 = b % l;
    b = (b - b1) / l;
    b2 = b % l;
    b = (b - b2) / l;
    b3 = b % l;
    s += a[b3] + a[b2] + a[b1];
  }
  return s;
}

// 解密
export function fromEncryptCode (str) {
  try {
    let test = JSON.parse(str)
    if (Object.prototype.toString.call(test) === '[object Object]') {
      return str
    }
  } catch (error) {
    sessionStorage.setItem('fromCodeError', error)
  }
  var key = "0123456789ABCDEFGQIJKLMNOPQRSTEVWXYZ";
  var l = key.length;
  var b, b1, b2, b3, d = 0, s;
  s = new Array(Math.floor(str.length / 3));
  b = s.length;
  for (var i = 0; i < b; i++) {
    b1 = key.indexOf(str.charAt(d));
    d++;
    b2 = key.indexOf(str.charAt(d));
    d++;
    b3 = key.indexOf(str.charAt(d));
    d++;
    s[i] = b1 * l * l + b2 * l + b3
  }
  b = eval("String.fromCharCode(" + s.join(',') + ")");
  return b;
}

export function delDir (path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

export function parseDateStr (date, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss'
  const newDate = dayjs(date).format(format)
  return newDate
}

export function treeData (data) {
  if (data === undefined) { return [] }
  let cloneData = JSON.parse(JSON.stringify(data))
  return cloneData.filter(father => {
    let branchArr = cloneData.filter(child => father.id == child.parent_id)  //返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : ''  //如果存在子级，则给父级添加一个children属性，并赋值
    return father.parent_id == 0;   //返回第一层
  });
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parent_id') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}