const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendApplicationEmail(application) {
  const {
    applicant_name,
    applicant_email,
    applicant_phone,
    cover_letter,
    job_title,
  } = application;

  const mailOptions = {
    from: `"NCC Careers" <${process.env.EMAIL_USER}>`,
    to: applicant_email,
    subject: `Application Received – ${job_title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a237e; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0;">NCC Careers</h1>
        </div>
        <div style="padding: 24px; background: #f5f5f5;">
          <h2 style="color: #1a237e;">Application Confirmation</h2>
          <p>Dear <strong>${applicant_name}</strong>,</p>
          <p>Thank you for applying for the position of <strong>${job_title}</strong> at NCC. We have successfully received your application.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${applicant_name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${applicant_email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${applicant_phone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Position</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${job_title}</td></tr>
          </table>
          ${cover_letter ? `<p><strong>Cover Letter:</strong></p><p style="background: white; padding: 12px; border-radius: 4px;">${cover_letter}</p>` : ""}
          <p>Our team will review your application and get back to you shortly.</p>
          <p style="color: #666; font-size: 14px;">Best regards,<br/>NCC Recruitment Team</p>
        </div>
        <div style="background: #1a237e; color: white; padding: 12px; text-align: center; font-size: 12px;">
          &copy; 2026 NCC. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendApplicationEmail };
