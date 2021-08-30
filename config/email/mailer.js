import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: global.config.email.host,
  secureConnection: global.config.email.secureConnection,
  port: global.config.email.port,
  secure: global.config.email.secure,
  tls: {
    //Since our mail server doesn't have ssl, I have no choice bu to disable this.
    //This is very dangerous
    rejectUnauthorized: global.config.email.tls.rejectUnauthorized
  },
  auth: {
    user: global.config.email.user,
    pass: global.config.email.pass
  }
});
export default class mailer {
  static sendMail (pack) {
    // setup email data with unicode symbols
    const mailOptions = {
      from: global.config.email.user,
      to: pack.email,
      subject: pack.title,
      replyTo: global.config.email.replyTo,
      html: pack.content,
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return console.log('error', error);
      else
        console.log('Message sent to:', pack.email);
    });
  }
}
