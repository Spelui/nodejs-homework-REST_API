const sgMail = require('@sendgrid/mail');

const sendMailSendDGrid = (email, verificationToken) => {
  sgMail.setApiKey(process.env.SENDGRID_API);
  const msg = {
    to: email,
    from: process.env.SENDER_MAIL,
    subject: 'Confirm your mail',
    html: `<strong>Link for email verification :</strong><a href="http://localhost:3000/api/users/verify/${verificationToken}">go for confirmation</a>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendMailSendDGrid;
