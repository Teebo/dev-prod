const nodemailer = require("nodemailer");
const sendMail = (devEmail) => {
  let transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 465,
    secure: true,
    auth: {
      user: "AKIA3ENJY6CJ5FZEXF55",
      pass: "BEtoOR6IrvQLxbSfsU/73L/GLbRT6GsZ21qPLT+O3jZW"
    }
  });

  let mailOptions = {
    from: 'sourcepolice.devops@.code',
    to: devEmail,
    subject: "Multiple work items in progress",
    text: 'Hey man',
    html: `
      Hey man
    `
  };


  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
