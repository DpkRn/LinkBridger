const nodemailer = require("nodemailer");
const { Verification_Email_Template } = require("./emailTemplate");
const transport = nodemailer.createTransport({
  service: "gmail",
  port: "465",
  auth: {
    user: "d.wizard.techno@gmail.com",
    pass: "boozsksocsbmadau",
  },
});

const sendOtpVerification = async (otp, email, username,AppName) => {
   
  const data = {
    from: `"${AppName}" <d.wizard.techno@gmail.com>`,
    to: email,
    subject: "Your OTP Verification Code",
    text: `Hello ${username}`,
    html: Verification_Email_Template.replace("{verificationCode}",otp).replace('{username}',username)
  };


  try{

    const info=await transport.sendMail(data);
    if(info){
        console.log("email sent !");
    }
  }catch(err){
    console.log(err)
  }
};
const sendEmailVerification = async (verificationLink, email, username,AppName) => {
  const data = {
    sender: `"${AppName}" <d.wizard.techno@gmail.com>`,
    reciever: email,
    subject: "Your Email Verification Link",
    text: "",
    html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        .email-container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            padding: 20px;
            text-align: center;
        }
        .email-content {
            background-color: #ffffff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            display: inline-block;
            text-align: left;
            max-width: 600px;
            margin: 0 auto;
        }
        .email-content h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .verify-button {
            display: inline-block;
            padding: 12px 24px;
            margin-top: 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .verify-button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-content">
            <h1>Email Verification</h1>
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for signing up at <strong>${AppName}</strong>! To complete your registration, please verify your email address by clicking the button below:</p>
            <a href=${verificationLink} class="verify-button">Verify Your Email</a>
            <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
            <p><a href=${verificationLink}>${verificationLink}</a></p>
            <p>If you did not create an account, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 ${AppName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>


        `,
  };


  try{

    const info=await transport.sendMail(data);
    if(info){
        console.log(info);
    }
  }catch(err){
    console.log(err)
  }
};

module.exports={
    sendEmailVerification,
    sendOtpVerification,
}
