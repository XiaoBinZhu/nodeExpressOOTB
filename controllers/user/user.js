import { v4 as uuidv4 } from "uuid";
import { resStatusCallback, responseDefault } from "../../utlis/utlis.js";
import wx_api from "../../config/wx/index.js";
import wx_PublicApi from '../../utlis/wx/index.js'
export default class users {

  /**
   * @param {[String]} code 
   * @return {*} session_key 
   */
  static wxLogin (req, res) {
    let messageCall = responseDefault()
    let { code, encryptedData  } = req.query
    wx_api.getCode2Session({ code }).then(async session_key => {
      let data = await wx_PublicApi.decryptUserInfoData(session_key,encryptedData, iv)
      messageCall.data.info = data
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
  static async wxEncryptedData (req, res) {
    let messageCall = responseDefault()
    let { sessionKey, encryptedData, iv } = req.body
    let session_key = sessionKey
    let data = await wx_PublicApi.decryptUserInfoData(session_key,encryptedData, iv)
    messageCall.data.info = data
    resStatusCallback(res, 200, messageCall)
  }
}