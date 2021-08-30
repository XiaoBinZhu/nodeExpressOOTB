let pubChannel = null;
let queue = [];
let conn = null;

export default class amqChannel {
  static startPublisher (amqpConn) {
    const self = this;
    conn = amqpConn;
    console.log("start a channel");
    conn.createConfirmChannel().then((ch) => {
      //subscribe events
      ch.on("error", (err) => {
        console.error("[AMQP] channel error", err.message);
      });
      ch.on("close", () => {
        console.log("[AMQP] channel closed");
      });

      console.log("publish channel is created");
      pubChannel = ch;
      //publish the unpublished msg from queue
      while (true) {
        let m = queue.shift();
        if (!m) break;
        self.publish(m);
      }
    }).catch((err) => {
      self.closeOnErr(err)
    });
  }

  //call publish to push msg into onlineQueue
  //publish([exchange, routingKey, content]);
  static publish (m) {
    try {
      //m is the message object
      pubChannel.publish(m[0], m[1], m[2], { persistent: true }, (err, ok) => {
        if (err) {
          console.error("[AMQP] publish1:", err)
          queue.push(m); //wait for next call
          pubChannel.connection.close();
        }
      });
    } catch (err) {
      console.error("[AMQP] publish2:", err.message);
      queue.push(m);
    }
  }

  static closeOnErr (err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    conn.close();
    return true;
  }
}
