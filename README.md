# NCC-Careers

## Email configuration

The backend uses Gmail SMTP to send application confirmations and status updates. To make it work:

1. Clone `.env.example` to `.env` (it is ignored by git).
2. Set `EMAIL_USER` to your Gmail account and `EMAIL_PASS` to a 16‑character app password (not your login password).
   - Enable 2‑Step Verification on the Google account.
   - Create an "App Password" from the security settings (choose "Mail" -> "Other").
3. Restart the backend; the transporter connection is verified on startup (`Mail server ready` in logs).

Other environment variables are described in the example file.
