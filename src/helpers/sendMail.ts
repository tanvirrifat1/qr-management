import nodemailer from 'nodemailer';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../config';

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: Number(config.email.port),
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"EBAX" ${config.email.from}`, // Sender address
      to: email, // Recipient's email
      subject: `${subject}`, // Subject line
      text: text, // Plain text version
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      font-family: Arial, sans-serif;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e5e5;
    }

    .header h1 {
      font-size: 20px;
      color: #222;
      margin: 0;
      font-weight: 600;
    }

    .content {
      padding: 20px 0;
      font-size: 15px;
      line-height: 1.6;
      color: #555;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      padding-top: 15px;
      border-top: 1px solid #e5e5e5;
      margin-top: 20px;
    }

    @media (max-width: 600px) {
      .container {
        margin: 15px;
        padding: 20px;
      }
      .header h1 {
        font-size: 18px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>${subject}</h1>
    </div>

    <div class="content">
      <p>${text}</p>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} EBAX. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`,
    });

    return info;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error sending email'
    );
  }
}
