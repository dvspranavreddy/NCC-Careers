const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");
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

// PATCH - Update application status (protected)
router.patch("/applications/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "shortlisted", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await pool.query(
      "UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
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

// GET - Dashboard stats (protected)
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalApps = await pool.query("SELECT COUNT(*) FROM applications");
    const pendingApps = await pool.query("SELECT COUNT(*) FROM applications WHERE status = 'pending'");
    const shortlistedApps = await pool.query("SELECT COUNT(*) FROM applications WHERE status = 'shortlisted'");
    const activeJobs = await pool.query("SELECT COUNT(*) FROM jobs WHERE is_active = true");

    res.json({
      totalApplications: parseInt(totalApps.rows[0].count),
      pendingApplications: parseInt(pendingApps.rows[0].count),
      shortlistedApplications: parseInt(shortlistedApps.rows[0].count),
      activeJobs: parseInt(activeJobs.rows[0].count),
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
