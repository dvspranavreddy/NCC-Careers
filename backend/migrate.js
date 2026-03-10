const pool = require("./db");
require("dotenv").config();

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function migrate() {
  try {
    console.log("Running migration: add slug column to jobs...");

    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'jobs' AND column_name = 'slug'
        ) THEN
          ALTER TABLE jobs ADD COLUMN slug VARCHAR(255);
        END IF;
      END $$;
    `);

    // Populate slugs for any rows that don't have one
    const jobs = await pool.query("SELECT id, title FROM jobs WHERE slug IS NULL");
    for (const job of jobs.rows) {
      const slug = toSlug(job.title);
      await pool.query("UPDATE jobs SET slug = $1 WHERE id = $2", [slug, job.id]);
      console.log(`  Set slug "${slug}" for job id ${job.id}`);
    }

    // Add unique constraint if not present
    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'jobs_slug_key'
        ) THEN
          ALTER TABLE jobs ADD CONSTRAINT jobs_slug_key UNIQUE (slug);
        END IF;
      END $$;
    `);

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrate();
