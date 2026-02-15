const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Crushly 💖" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes</p>
    `,
  });
};

module.exports = sendMail;
