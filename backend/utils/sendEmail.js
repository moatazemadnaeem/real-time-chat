const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const SendEmail = (email, otp) => {
  const msg = {
    to: email, // Change to your recipient
    from: "moatazwork0@gmail.com", // Change to your verified sender
    subject: "Email confirmation",
    text: `Please Press This Link http://localhost:9000/api/users/verfiy-user/${otp} to verify your email. Thanks`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { SendEmail };
