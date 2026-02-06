const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sakshambalotra2004gmail@gmail.com",
    pass: "your_app_password", // NOT normal password
  },
});

transporter.sendMail(
  {
    from: "sakshambalotra2004@gmail.com",
    to: "balotra2004gmail@gmail.com",
    subject: "Nodemailer Test",
    text: "If you got this email, nodemailer is working!",
  },
  (err, info) => {
    if (err) {
      console.error("❌ Email failed:", err);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  }
);
