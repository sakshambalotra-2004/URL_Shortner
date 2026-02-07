const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sakshambalotra2004@gmail.com", // ✅ correct email
    pass: "uwyejuxogeugvjwm",              // ✅ app password
  },
});

transporter.sendMail(
  {
    from: "sakshambalotra2004@gmail.com",  // ✅ must match user
    to: "balotra2004@gmail.com",
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
