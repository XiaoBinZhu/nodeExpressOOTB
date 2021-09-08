'use strict';
import request from "request"
import qs from "qs"

const { appid, secret } = global.config.weixin;

export default class wx {
  static getToken (code) {
    let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
    let params = {
      appid: appid,
      secret: secret,
      code: code,
      grant_type: 'authorization_code'
    };
    let options = {
      method: 'get',
      url: reqUrl + qs.stringify(params)
    };
    return new Promise((resolve, reject) => {
      request(options, function (err, res, body) {
        if (res) {
          resolve(JSON.parse(body));
        } else {
          reject(err);
        }
      })
    })
  }

  static getCode2Session (data) {
    let reqUrl = 'https://api.weixin.qq.com/sns/jscode2session?';
    let { code } = data
    let params = {
      appid: appid,
      secret: secret,
      js_code: code,
      grant_type: 'authorization_code'
    };
    let options = {
      method: 'get',
      url: reqUrl + qs.stringify(params)
    };
    return new Promise((resolve, reject) => {
      request(options, function (err, res, body) {
        if (res) {
          resolve(JSON.parse(body));
        } else {
          reject(err);
        }
      })
    })
  }

  static getUserInfo (wechatId, accessToken) {
    let reqUrl = 'https://api.weixin.qq.com/sns/userinfo?';
    let params = {
      access_token: accessToken,
      openid: wechatId,
      lang: 'zh_CN'
    }
    let options = {
      method: 'get',
      url: reqUrl + qs.stringify(params)
    };
    return new Promise((resolve, reject) => {
      request(options, function (err, res, body) {
        if (res) {
          resolve(JSON.parse(body));
        } else {
          reject(err);
        }
      });
    })
  }
}