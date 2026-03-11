const nodemailer = require('nodemailer');
require('dotenv').config();

// create transporter using Gmail SMTP (works with app passwords)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // starttls
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// verify connection at startup
transporter.verify((error, success) => {
  if (error) console.error('SMTP connection failed:', error);
  else console.log('Mail server ready');
});

/**
 * Generic helper which sends a simple HTML email.
 * @returns {boolean} true on success, false on failure
 */
async function sendEmail(to, subject, htmlBody) {
  console.log('[emailService] sendEmail called', { to, subject });
  try {
    const info = await transporter.sendMail({
      from: `"HR Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlBody,
    });
    console.log('[emailService] Email sent:', info.messageId);
    return true;
  } catch (err) {
    console.error('[emailService] Email failed:', err.message);
    return false;
  }
}

/**
 * Send the standard confirmation that an application was received.
 */
async function sendApplicationEmail(application) {
  console.log('[emailService] sendApplicationEmail called', application);
  const {
    applicant_name,
    applicant_email,
    applicant_phone,
    cover_letter,
    job_title,
  } = application;

  const textBody = `Hello ${applicant_name},\n\n` +
    `Thank you for applying to the ${job_title} role at NCC. ` +
    `Here is what we received:\n` +
    `Name: ${applicant_name}\n` +
    `Email: ${applicant_email}\n` +
    `Phone: ${applicant_phone}\n` +
    `Position: ${job_title}\n` +
    (cover_letter ? `Cover Letter: ${cover_letter}\n` : ``) +
    `\nWe will review your submission and get back to you soon.\n\n` +
    `Best regards,\nNCC Recruitment Team`;

  const htmlBody = `
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
    `;

  // send to applicant
  const ok = await sendEmail(applicant_email, `Application Received – ${job_title}`, htmlBody);
  // also send copy to admin
  if (ok) {
    await sendEmail(process.env.EMAIL_USER, `[COPY] Application Received – ${job_title}`, htmlBody);
  }
  return ok;
}

/**
 * Send a simple status update message depending on type.
 */
async function sendStatusEmail(application, statusType) {
  console.log('[emailService] sendStatusEmail called', { application, statusType });
  const { applicant_name, applicant_email, job_title } = application;
  let subject = '';
  let body = '';

  switch (statusType) {
    case 'under_review':
      subject = `Your application is under review`;
      body = `Dear ${applicant_name}, your application for ${job_title} is currently under review. We will get back to you shortly.`;
      break;
    case 'shortlisted':
      subject = `Congratulations! Shortlisted for ${job_title}`;
      body = `Congratulations! You have been shortlisted for ${job_title} at NCC.`;
      break;
    case 'accepted':
      subject = `Application Accepted`;
      body = `Congratulations! Your application for ${job_title} has been accepted.`;
      break;
    case 'rejected':
      subject = `Application Update`;
      body = `We regret to inform you that your application for ${job_title} was not selected.`;
      break;
    default:
      return false;
  }

  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a237e; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0;">NCC Careers</h1>
        </div>
        <div style="padding: 24px; background: #f5f5f5;">
          <p>${body}</p>
          <p style="color: #666; font-size: 14px;">Best regards,<br/>NCC Recruitment Team</p>
        </div>
        <div style="background: #1a237e; color: white; padding: 12px; text-align: center; font-size: 12px;">
          &copy; 2026 NCC. All rights reserved.
        </div>
      </div>
    `;

  return sendEmail(applicant_email, subject, html);
}

module.exports = { sendEmail, sendApplicationEmail, sendStatusEmail };
