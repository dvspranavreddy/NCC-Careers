const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const { sendStatusEmail } = require("../services/emailService");
require("dotenv").config();

// POST - Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET - All applications (protected)
router.get("/applications", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, j.title AS job_title, j.department, j.location
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       ORDER BY a.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// PATCH - Mark view detail clicked; send email ONLY on first click, change status to under_review ONLY on first click
// path updated to match frontend expectation (/view-detail)
router.patch("/applications/:id/view-detail", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const appRes = await pool.query("SELECT * FROM applications WHERE id = $1", [id]);
    if (appRes.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }
    const app = appRes.rows[0];

    // Only do special logic on the FIRST click
    const isFirstClick = !app.view_detail_clicked;

    let newStatus = app.status;
    if (isFirstClick && app.status === "pending") {
      // Change status to under_review only on first click and only if still pending
      newStatus = "under_review";
    }

    const result = await pool.query(
      `UPDATE applications
       SET view_detail_clicked = TRUE,
           status = $1,
           email_sent = CASE WHEN $2 THEN TRUE ELSE email_sent END,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [newStatus, isFirstClick, id]
    );

    // Send email ONLY on first click
    if (isFirstClick) {
      try {
        // Pass job_title along since app row may not have it (it comes from JOIN)
        await sendStatusEmail(app, "under_review");
        // mark email_sent flag in db if not already done above
        await pool.query("UPDATE applications SET email_sent = TRUE WHERE id = $1", [id]);
      } catch (emailErr) {
        console.error("Error sending under_review email:", emailErr.message);
      }
    }

    // Re-fetch with job info so the modal gets full data
    const fullApp = await pool.query(
      `SELECT a.*, j.title AS job_title, j.department, j.location
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [id]
    );

    res.json(fullApp.rows[0]);
  } catch (err) {
    console.error("Error handling view detail:", err);
    res.status(500).json({ error: "Failed to process view detail" });
  }
});

// PATCH - Update application status (protected)
router.patch("/applications/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "under_review", "shortlisted", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Fetch full application (with job title via JOIN) before update so email has all fields
    const appRes = await pool.query(
      `SELECT a.*, j.title AS job_title, j.department, j.location
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [id]
    );
    if (appRes.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }
    const app = appRes.rows[0];

    // build update query; we will also bump email_sent if we send an email
    let updateQuery = "UPDATE applications SET status = $1, updated_at = NOW()";
    if (status === "under_review") {
      updateQuery += ", view_detail_clicked = TRUE";
    }
    // email_sent will be updated separately below if we actually send
    updateQuery += " WHERE id = $2 RETURNING *";

    const result = await pool.query(updateQuery, [status, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Send email for shortlisted, accepted, rejected
    const emailStatuses = ["shortlisted", "accepted", "rejected"];
    if (emailStatuses.includes(status)) {
      try {
        await sendStatusEmail(app, status);
        // mark email flag so UI can show email was sent
        await pool.query("UPDATE applications SET email_sent = TRUE WHERE id = $1", [id]);
      } catch (emailErr) {
        console.error("Failed to send status email:", emailErr.message);
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating application:", err);
    res.status(500).json({ error: "Failed to update application" });
  }
});

// DELETE - Delete application (protected)
router.delete("/applications/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application deleted" });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ error: "Failed to delete application" });
  }
});

// ─── JOB MANAGEMENT ─────────────────────────────────────────

// Helper: generate slug from title
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// GET - All jobs (protected, includes inactive)
router.get("/jobs", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// POST - Create new job (protected)
router.post("/jobs", authMiddleware, async (req, res) => {
  try {
    const { title, department, location, type, experience, salary_range, description, requirements, responsibilities } = req.body;

    if (!title || !department || !location || !type || !experience || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = toSlug(title);

    // Check slug uniqueness
    const existing = await pool.query("SELECT id FROM jobs WHERE slug = $1", [slug]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "A job with a similar title already exists" });
    }

    const result = await pool.query(
      `INSERT INTO jobs (title, slug, department, location, type, experience, salary_range, description, requirements, responsibilities)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, slug, department, location, type, experience, salary_range || null, description, requirements || [], responsibilities || []]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// PATCH - Update job (protected)
router.patch("/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, location, type, experience, salary_range, description, requirements, responsibilities, is_active } = req.body;

    const existing = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    const job = existing.rows[0];
    const newTitle = title !== undefined ? title : job.title;
    const newSlug = title !== undefined ? toSlug(title) : job.slug;

    // Check slug uniqueness if title changed
    if (title !== undefined && newSlug !== job.slug) {
      const slugCheck = await pool.query("SELECT id FROM jobs WHERE slug = $1 AND id != $2", [newSlug, id]);
      if (slugCheck.rows.length > 0) {
        return res.status(409).json({ error: "A job with a similar title already exists" });
      }
    }

    const result = await pool.query(
      `UPDATE jobs SET
        title = $1, slug = $2, department = $3, location = $4, type = $5,
        experience = $6, salary_range = $7, description = $8,
        requirements = $9, responsibilities = $10, is_active = $11, updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        newTitle, newSlug,
        department !== undefined ? department : job.department,
        location !== undefined ? location : job.location,
        type !== undefined ? type : job.type,
        experience !== undefined ? experience : job.experience,
        salary_range !== undefined ? salary_range : job.salary_range,
        description !== undefined ? description : job.description,
        requirements !== undefined ? requirements : job.requirements,
        responsibilities !== undefined ? responsibilities : job.responsibilities,
        is_active !== undefined ? is_active : job.is_active,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ error: "Failed to update job" });
  }
});

// DELETE - Delete job (protected)
router.delete("/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM jobs WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// ─── STATS ──────────────────────────────────────────────────

// GET - Dashboard stats (protected)
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalApps        = await pool.query("SELECT COUNT(*) FROM applications");
    const pendingApps      = await pool.query("SELECT COUNT(*) FROM applications WHERE status = 'pending'");
    const underReviewApps  = await pool.query("SELECT COUNT(*) FROM applications WHERE status IN ('under_review','reviewed')");
    const shortlistedApps  = await pool.query("SELECT COUNT(*) FROM applications WHERE status = 'shortlisted'");
    const acceptedApps     = await pool.query("SELECT COUNT(*) FROM applications WHERE status = 'accepted'");
    const rejectedApps     = await pool.query("SELECT COUNT(*) FROM applications WHERE status = 'rejected'");
    const activeJobs       = await pool.query("SELECT COUNT(*) FROM jobs WHERE is_active = true");

    res.json({
      totalApplications:      parseInt(totalApps.rows[0].count),
      pendingApplications:    parseInt(pendingApps.rows[0].count),
      underReviewApplications:parseInt(underReviewApps.rows[0].count),
      shortlistedApplications:parseInt(shortlistedApps.rows[0].count),
      acceptedApplications:   parseInt(acceptedApps.rows[0].count),
      rejectedApplications:   parseInt(rejectedApps.rows[0].count),
      activeJobs:             parseInt(activeJobs.rows[0].count),
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;