const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const pool = require("../db");
const { sendApplicationEmail } = require("../services/emailService");

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST - Submit application
router.post("/", upload.single("resume"), async (req, res) => {
  console.log('[applications] received POST /, body:', req.body, 'file:', req.file && req.file.originalname);
  try {
    const { job_id, applicant_name, applicant_email, applicant_phone, cover_letter } = req.body;

    if (!job_id || !applicant_name || !applicant_email || !applicant_phone) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicant_email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const resumePath = req.file ? req.file.filename : null;

    // Get job title for the email
    const jobResult = await pool.query("SELECT title FROM jobs WHERE id = $1", [job_id]);
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    const job_title = jobResult.rows[0].title;

    // Check for duplicate application (same email + same job)
    const dupCheck = await pool.query(
      "SELECT id FROM applications WHERE job_id = $1 AND applicant_email = $2",
      [job_id, applicant_email]
    );
    if (dupCheck.rows.length > 0) {
      return res.status(409).json({
        error: "DUPLICATE_APPLICATION",
        message: "You have already applied for this position. You are welcome to apply for other openings.",
      });
    }

    const result = await pool.query(
      `INSERT INTO applications (job_id, applicant_name, applicant_email, applicant_phone, resume_path, cover_letter)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [job_id, applicant_name, applicant_email, applicant_phone, resumePath, cover_letter || null]
    );

    // Respond to the client immediately, then send the email in background
    res.status(201).json({
      message: "Application submitted successfully",
      application: result.rows[0],
    });

    // background email - we don't wait for it so UI is snappy
    (async () => {
      try {
        const ok = await sendApplicationEmail({
          applicant_name,
          applicant_email,
          applicant_phone,
          cover_letter,
          job_title,
        });
        console.log("[applications] confirmation email sent?", ok);
        if (ok) {
          await pool.query("UPDATE applications SET email_sent = TRUE WHERE id = $1", [result.rows[0].id]);
        }
      } catch (emailErr) {
        console.error("Email sending failed (background):", emailErr);
      }
    })();
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

module.exports = router;
