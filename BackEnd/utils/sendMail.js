const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, otp) => {
  await resend.emails.send({
    from: "Crushly 💖 <onboarding@resend.dev>",
    to,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes </p>
    `,
  });
};

module.exports = sendMail;
