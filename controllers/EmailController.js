const nodemailer = require('nodemailer');

async function sendEmail(senderEmail, receiverEmail, subject, body) {
  if (!senderEmail ||  !receiverEmail || !subject || !body) {
    throw new Error('All fields are required.');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.NODEMAILER_USER, 
        pass: process.env.NODEMAILER_PASSWORD, 
      },
    });
    const mailOptions = {
      from: senderEmail,
      to: receiverEmail,
      subject: subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);
console.log("Email sent")
    return 'Email sent successfully!';
  } catch (error) {
    throw new Error('Failed to send email: ' + error.message);
  }
}

module.exports = sendEmail;
