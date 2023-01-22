const nodemailer = require("nodemailer");

async function sendEmail({ html, to }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const result = await transporter.sendMail({
    from: '"Mern Media" <mernmedia@gmail.com>',
    subject: "Reset your Mern Media password",
    html: html,
    to,
  });

  return result;
}

module.exports = sendEmail;
