import { v4 as uuidv4 } from "uuid";
import { resStatusCallback, responseDefault } from "../../utlis/utlis.js";

export default class users {

  /**
   * @param {[String]} code 
   * @return {*} session_key 
   */
  static wxGetSessionKey (req, res) {
    let messageCall = responseDefault()
    let { code } = req.query
    getCode2Session({ appid, secret, code }).then(session => {
      messageCall.data.info = session
      resStatusCallback(res, 200, messageCall)
    }).catch(err => {
      messageCall.message = err.errcode
      resStatusCallback(res, 404, messageCall)
    })
  }

  /**
   * @param {[String]} session_key 
   * @param {[String]} encryptedData
   * @param {[String]} iv 
   * @return {*} EncryptedData 
   */
  static wxEncryptedData (req, res) {
    let messageCall = responseDefault()
    let { sessionKey, encryptedData, iv } = req.body
    let session_key = sessionKey
    let pc = new WXBizDataCrypt(appid, session_key)
    let data = pc.decryptData(encryptedData, iv)
    messageCall.data.info = data
    resStatusCallback(res, 200, messageCall)
  }

  static wxGetSessionToUserInfo (req, res) {
    let { appid, secret, code, encryptedData, iv } = req.body
    let messageCall = responseDefault()
    console.log(req.body);
    getCode2Session({ appid, secret, code }).then(session => {
      let { session_key } = session
      let sessionKey = session_key
      let pc = new WXBizDataCrypt(appid, sessionKey)
      let data = pc.decryptData(encryptedData, iv)
      messageCall.data.info = data
      resStatusCallback(res, 200, messageCall)
    }).catch(err => {
      messageCall.message = err.errcode
      resStatusCallback(res, 404, messageCall)
    })
  }
}
// export default new users()