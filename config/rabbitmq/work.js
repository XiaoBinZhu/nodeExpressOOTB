import mailer from "../email/mailer.js";
// let cell = require('../sender/cell.js');
let amqpConn = null;

export default class amqWork {
  static startWorker (amqpConn) {
    const self = this;
    console.log('start worker');
    amqpConn.createChannel().then((ch) => {
      //Subscribe events
      ch.on("error", err => {
        console.error("[AMQP] channel error", err.message);
      });
      ch.on("close", () => {
        console.log("[AMQP] channel closed");
      });
      ch.prefetch(10);
      ch.assertQueue("verification", { durable: true }).then((_ok) => {
        ch.consume("verification", processMsgVeri, { noAck: false });
        console.log("Verification worker is started");
      }).catch((err) => {
        self.closeOnErr(err)
      })

      function processMsgVeri (msg) {
        self.workVerification(msg, ok => {
          try {
            if (ok)
              ch.ack(msg);
            else
              ch.reject(msg, true);
          } catch (e) {
            self.closeOnErr(e);
          }
        });
      }
    }).catch((err) => {
      self.closeOnErr()
    })
  }

  static workVerification (msg, callback) {
    try {
      let pack = JSON.parse(msg.content.toString());
      if (pack.email && pack.code) {
        const email = global.config.email.content
        pack.content = email.value;
        pack.title = email.title;
        mailer.sendMail(pack);
      }
      else if (pack.cellPhone && pack.code) {
        const phone = global.config.phone.content
        let isinvite = false;
        let content = phone.value;
        cell.sendSMS(pack.cellPhone, content, isinvite);
      }
      else
        throw "email and/or code is undefined";

    } catch (e) {
      console.log('content error:', msg.content.toString());
      console.log('error:', e);
      callback(false);
    }
    callback(true);
  }

  static closeOnErr (err) {
    if (!err) return false;
    console.error("[AMQP] error: from worker", err);
    amqpConn.close();
    return true;
  }
}
