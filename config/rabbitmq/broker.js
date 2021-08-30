import amqp from "amqplib";
import channel from "./channel.js";
import worker from "./work.js";
const url = global.config.amqp.url;
export default class rabbitmq_broler {
  static start () {
    console.log('start to connect');
    amqp.connect(url).then((conn) => {
      //subscribe to event
      conn.on("error", err => {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error:", err);
        }
      });
      conn.on("close", () => {
        console.error("[AMPQ] reconnecting");
        return setTimeout(start, 1000);
      });

      //setup variables and start channel and worker
      console.log('[AMPQ] connected');
      channel.startPublisher(conn);
      worker.startWorker(conn);
    }).catch((err) => {
      console.error('[AMQP]' + err.message);
      return;
    })
  };

  static pushContent (content, type) {
    let strObj = JSON.stringify(content);
    console.log(strObj);
    let buf = new Buffer.from(JSON.stringify(content));
    channel.publish(['', type, buf]);
  }
}