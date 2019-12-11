const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

const sendEmail = (to, subject, message) => {
  const mailOptions = {
    from: "anne@studiobicker.nl",
    to,
    subject,
    html: message
  };
  transport.sendMail(mailOptions, error => {
    if (error) {
      console.log(error);
    }
  });
};

module.exports = sendEmail;
