# NCC-Careers

## Application Flow

### Public User Flow
1. **User visits** `/careers` → Frontend loads job listings from `/api/jobs`
2. **User clicks** "Apply Now" → Navigates to `/apply/:jobSlug`
3. **User submits application** → Backend stores in database + sends confirmation email
4. **Status updates** → Admin updates application status in dashboard

### Admin Flow
1. **Admin visits** `/admin/login` → Takes access code (`ncc-career`)
2. **Admin logs in** → Backend authenticates with credentials, returns JWT token
3. **Admin navigates** `/admin/dashboard` → Fetches applications, stats, and job listings
4. **Admin manages**:
   - **Applications**: View details, update status (pending → under_review → shortlisted → accepted/rejected), delete records
   - **Jobs**: Create, edit, toggle active/inactive, delete listing
5. **Session protection**: `AdminRoute` component checks for stored JWT; redirects to login if missing

### Data Flow
```
Frontend (React + Vite)
    ↓
    ├→ Public Site: /api/jobs (GET)
    ├→ Applications: /api/applications (POST, GET)
    └→ Admin: /api/admin/* (GET, PATCH, DELETE) [requires JWT]
    ↓
Backend (Express + Node.js)
    ├→ Validates requests & auth tokens
    ├→ Queries PostgreSQL database
    ├→ Sends confirmation/status emails via SMTP
    └→ Returns JSON responses
    ↓
Database (PostgreSQL)
    ├→ jobs table (listings)
    ├→ applications table (applicant records)
    └→ admin_users table (login credentials)
```

---

## Email Configuration

**⚠️  Important Note: Google SMTP & Render Limitations**

Google SMTP (Gmail) **cannot be used** when the backend is deployed on Render because:
- Render's infrastructure is considered high-risk by Google's security filters
- Requests from Render IP ranges are flagged as spam/bot activity
- Even with valid app passwords, authentication fails or emails are blocked
- This affects both the deployed backend and local development if proxying through Render

**Solution**: Use a third-party email service that supports REST APIs or SMTP from cloud infrastructure:
- **Recommendation**: SendGrid, Mailgun, or Brevo (formerly Sendinblue)
- These services have proper cloud IP whitelisting and are built for deployed applications

### For Local Development
If running locally, you can use Gmail SMTP:

1. Clone `.env.example` to `.env` (it is ignored by git).
2. Set `EMAIL_USER` to your Gmail account and `EMAIL_PASS` to a 16‑character app password (not your login password).
   - Enable 2‑Step Verification on the Google account.
   - Create an "App Password" from the security settings (choose "Mail" → "Other").
3. Restart the backend; the transporter connection is verified on startup (`Mail server ready` in logs).

Other environment variables are described in the example file.
