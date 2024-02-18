const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production ') {
      // Sendgrid alt
      // console.log(
      //   'process.env.SENDGRID_ALT_EMAIL_HOST',
      //   process.env.SENDGRID_ALT_HOST,
      //   process.env.SENDGRID_ALT_USERNAME,
      //   process.env.SENDGRID_ALT_PASSWORD
      // );

      return nodemailer.createTransport({
        // service: 'SendGrid',
        host: process.env.SENDGRID_ALT_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.SENDGRID_ALT_USERNAME,
          pass: process.env.SENDGRID_ALT_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    const text = htmlToText(html, {
      wordwrap: 130
    });

    // 2) Define email options
    if (process.env.NODE_ENV === 'production ') {
      this.from = 'sample2003test@gmail.com';
    }
    const mailOptions = {
      // from: this.from,
      from: this.from,
      to: this.to,
      subject,
      html,
      text
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

// const sendEmail = async ({ email, subject, message }) => {
//   //1) Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     // secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.EMAIL_USERNAME, // generated ethereal user
//       pass: process.env.EMAIL_PASSWORD // generated ethereal password
//     }
//     // service: 'Gmail',
//     // auth: {
//     //   user: process.env.EMAIL_USERNAME,
//     //   pass: process.env.EMAIL_PASSWORD
//     // }
//   });
//   //2) Define the email options
//   const mailOptions = {
//     from: 'Natours xyz Jonas Schmedtmann',
//     to: email,
//     subject,
//     text: message
//   };
//   //3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };
