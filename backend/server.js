const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const jobsRouter = require("./routes/jobs");
const applicationsRouter = require("./routes/applications");
const adminRouter = require("./routes/admin");
// load mail service early so transporter is verified right away
const { sendEmail } = require("./services/emailService");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/admin", adminRouter);

// Ensure new columns exist in applications table (view_detail_clicked, email_sent)
const pool = require("./db");
async function ensureAppColumns() {
  try {
    await pool.query(
      `ALTER TABLE applications
       ADD COLUMN IF NOT EXISTS view_detail_clicked BOOLEAN DEFAULT FALSE`
    );
    await pool.query(
      `ALTER TABLE applications
       ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE`
    );
    // normalize any previously used 'reviewed' status to our new 'under_review'
    await pool.query(`UPDATE applications SET status = 'under_review' WHERE status = 'reviewed'`);
  } catch (err) {
    console.error("Error ensuring application columns:", err);
  }
}
ensureAppColumns();

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
