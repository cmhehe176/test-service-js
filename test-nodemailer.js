import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'aiot.platform.hust@gmail.com',
    pass: 'password application'
  }
});

let mailOptions = {
  from: '"Aiot-Platform" <aiot.platform.hust@gmail.coms>',
  to: 'congndm@rabiloo.com',
  subject: 'Test Email',
  text: 'Hello, this is a test email sent from Node.js!'
};

async function sendEmail() {
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log('Error occurred: ' + error.message);
  }
}

sendEmail();
