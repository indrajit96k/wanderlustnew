const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'indrajitshewale0101@gmail.com',
    pass: 'jesziwwenboqhcad'
  }
});

let mailOptions = {
  from: 'indrajitshewale0101@gmail.com',
  to: 'indrajitshewale96@gmail.com',
  subject: 'Hello from Nodemailer',
  text: 'This is a test email sent using Nodemailer!',
  html: '<h1>Hello from Nodemailer</h1><i>This is a test email sent using Nodemailer!</i>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
