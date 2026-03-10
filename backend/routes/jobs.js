const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM jobs WHERE is_active = true ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET single job by slug (or numeric id as fallback)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    // Use slug lookup; fallback to numeric id for backward compatibility
    const isNumeric = /^\d+$/.test(slug);
    const result = await pool.query(
      isNumeric
        ? "SELECT * FROM jobs WHERE id = $1"
        : "SELECT * FROM jobs WHERE slug = $1",
      [slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

module.exports = router;
