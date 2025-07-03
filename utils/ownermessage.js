function ContactOwner(bookingdate, leavedate, owneremail, useremail) {
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: 'indrajitshewale0101@gmail.com',
            // pass: 'jesziwwenboqhcad' // Use .env in real apps
            user:process.env.WANDERLUST_EMAIL,
            pass:process.env.WANDERLUST_PASS
        }
    });

    let mailOptions = {
        from: 'indrajitshewale0101@gmail.com',
        to: owneremail,
        subject: 'New Booking Request - Wanderlust',
        text: `You have received a new booking request from ${useremail}.`,
        html: `
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow-wrap: break-word;">
      
      <h2 style="color: #4CAF50; text-align: center;">New Booking Request</h2>

      <p style="font-size: 16px; color: #333;">
        Hello, you have received a new booking request through <strong>Wanderlust</strong>. Below are the details:
      </p>

      <table style="width: 100%; font-size: 16px; color: #333; margin-top: 20px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%; vertical-align: top;">Customer Email:</td>
          <td style="padding: 8px 0; word-break: break-word; max-width: 60%;">${useremail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Booking Date:</td>
          <td style="padding: 8px 0;">${bookingdate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Leave Date:</td>
          <td style="padding: 8px 0;">${leavedate}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; font-size: 15px; color: #555;">
        Please reach out to the customer at the earliest to confirm the booking and coordinate further details.
      </p>

      <p style="margin-top: 40px; text-align: center; font-size: 14px; color: #999;">
        — Wanderlust Notifications
      </p>
    </div>
  </body>
</html>
`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Email sending failed:", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function OtpVerification(otp, useremail) {
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'indrajitshewale0101@gmail.com',
            pass: 'jesziwwenboqhcad' // App password, not your real Gmail password
        }
    });

    let mailOptions = {
        from: 'indrajitshewale0101@gmail.com',
        to: useremail,
        subject: 'Wanderlust OTP Verification',
        text: `Your OTP is: ${otp}`, // fallback for non-HTML clients
        html: `
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
                <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                  <h2 style="color: #4CAF50; text-align: center;">OTP Verification</h2>
                  <p style="font-size: 16px; color: #333;">Dear User,</p>
                  <p style="font-size: 16px; color: #333;">
                    Please use the following OTP to complete your signup process:
                  </p>
                  <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 28px; letter-spacing: 4px; color: #333; font-weight: bold; background-color: #f0f0f0; padding: 10px 20px; border-radius: 6px; display: inline-block;">
                      ${otp}
                    </span>
                  </div>
                  <p style="font-size: 14px; color: #666;">
                    This OTP is valid for 10 minutes. Please do not share it with anyone.
                  </p>
                  <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
                    — Wanderlust Team
                  </p>
                </div>
              </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Email sending failed:", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports={ContactOwner,OtpVerification};
