const pool = require("./db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function seed() {
  try {
    console.log("Creating tables...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        experience VARCHAR(50) NOT NULL,
        salary_range VARCHAR(100),
        description TEXT NOT NULL,
        requirements TEXT[] NOT NULL,
        responsibilities TEXT[] NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add slug column to existing table if not present
    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'jobs' AND column_name = 'slug'
        ) THEN
          ALTER TABLE jobs ADD COLUMN slug VARCHAR(255) UNIQUE;
        END IF;
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        applicant_name VARCHAR(255) NOT NULL,
        applicant_email VARCHAR(255) NOT NULL,
        applicant_phone VARCHAR(20) NOT NULL,
        resume_path VARCHAR(500),
        cover_letter TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (job_id, applicant_email)
      );
    `);

    // Add unique constraint to existing table if it doesn't exist
    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'applications_job_id_applicant_email_key'
        ) THEN
          ALTER TABLE applications ADD CONSTRAINT applications_job_id_applicant_email_key UNIQUE (job_id, applicant_email);
        END IF;
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Tables created successfully.");

    // Seed admin user
    const adminExists = await pool.query("SELECT * FROM admins WHERE username = 'admin'");
    if (adminExists.rows.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await pool.query(
        "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
        ["admin", hash]
      );
      console.log("Admin user created (username: admin, password: admin123)");
    }

    // Seed jobs
    const jobsExist = await pool.query("SELECT COUNT(*) FROM jobs");
    if (parseInt(jobsExist.rows[0].count) === 0) {
      const jobs = [
        {
          slug: "senior-software-engineer",
          title: "Senior Software Engineer",
          department: "Engineering",
          location: "Bangalore, India",
          type: "Full-time",
          experience: "5-8 years",
          salary_range: "₹18L - ₹30L per annum",
          description:
            "We are looking for an experienced Senior Software Engineer to join our Engineering team. You will design, develop, and maintain scalable applications, mentor junior developers, and drive technical excellence across projects.",
          requirements: [
            "Bachelor's or Master's degree in Computer Science or related field",
            "5+ years of experience with Node.js, React, or similar technologies",
            "Strong understanding of data structures, algorithms, and system design",
            "Experience with cloud platforms (AWS/Azure/GCP)",
            "Excellent problem-solving and communication skills",
          ],
          responsibilities: [
            "Design and develop high-quality, scalable web applications",
            "Collaborate with cross-functional teams to define and implement features",
            "Conduct code reviews and mentor junior team members",
            "Participate in architecture and design discussions",
            "Troubleshoot production issues and implement solutions",
          ],
        },
        {
          slug: "project-manager",
          title: "Project Manager",
          department: "Operations",
          location: "Mumbai, India",
          type: "Full-time",
          experience: "6-10 years",
          salary_range: "₹15L - ₹25L per annum",
          description:
            "NCC is seeking an experienced Project Manager to lead and deliver complex infrastructure and construction projects. You will manage project lifecycles, coordinate with stakeholders, and ensure timely delivery within budget.",
          requirements: [
            "Bachelor's degree in Civil Engineering or Construction Management",
            "PMP or Prince2 certification preferred",
            "6+ years of project management experience in construction/infrastructure",
            "Proficiency in project management tools (MS Project, Primavera)",
            "Strong leadership and stakeholder management skills",
          ],
          responsibilities: [
            "Plan, execute, and close projects according to strict deadlines",
            "Manage project scope, schedule, budget, and resources",
            "Coordinate with engineers, contractors, and clients",
            "Prepare and present project status reports to leadership",
            "Identify and mitigate project risks proactively",
          ],
        },
        {
          slug: "data-analyst",
          title: "Data Analyst",
          department: "Analytics",
          location: "Hyderabad, India",
          type: "Full-time",
          experience: "2-4 years",
          salary_range: "₹8L - ₹14L per annum",
          description:
            "Join our Analytics team to turn raw data into actionable insights. You will work with large datasets, build dashboards, and support data-driven decision-making across the organization.",
          requirements: [
            "Bachelor's degree in Statistics, Mathematics, or Computer Science",
            "Proficiency in SQL, Python, and data visualization tools (Tableau/Power BI)",
            "2+ years of experience in data analysis or business intelligence",
            "Strong analytical thinking and attention to detail",
            "Experience with statistical analysis and data modeling",
          ],
          responsibilities: [
            "Analyze large datasets to identify trends and patterns",
            "Build and maintain interactive dashboards and reports",
            "Collaborate with business teams to understand data needs",
            "Develop data pipelines and automate reporting processes",
            "Present findings and recommendations to stakeholders",
          ],
        },
        {
          slug: "civil-site-engineer",
          title: "Civil Site Engineer",
          department: "Construction",
          location: "Delhi NCR, India",
          type: "Full-time",
          experience: "3-5 years",
          salary_range: "₹6L - ₹10L per annum",
          description:
            "NCC is hiring a Civil Site Engineer to oversee construction activities at project sites. You will ensure quality standards, monitor progress, and coordinate with contractors and labor teams.",
          requirements: [
            "Bachelor's degree in Civil Engineering",
            "3+ years of on-site construction experience",
            "Knowledge of construction materials, methods, and regulations",
            "Ability to read and interpret blueprints and technical drawings",
            "Strong organizational and problem-solving skills",
          ],
          responsibilities: [
            "Supervise day-to-day construction activities on site",
            "Ensure adherence to quality standards and safety regulations",
            "Coordinate with contractors, laborers, and suppliers",
            "Maintain daily progress logs and site documentation",
            "Report project progress and issues to the Project Manager",
          ],
        },
        {
          slug: "hr-business-partner",
          title: "HR Business Partner",
          department: "Human Resources",
          location: "Chennai, India",
          type: "Full-time",
          experience: "4-7 years",
          salary_range: "₹10L - ₹18L per annum",
          description:
            "We are looking for an HR Business Partner to align business objectives with people strategies. You will work closely with leadership to drive talent acquisition, employee engagement, and organizational development initiatives.",
          requirements: [
            "MBA in Human Resources or related field",
            "4+ years of HR experience, preferably in infrastructure/construction",
            "Strong knowledge of labor laws and HR best practices",
            "Excellent interpersonal and negotiation skills",
            "Experience with HRIS systems and talent management tools",
          ],
          responsibilities: [
            "Partner with business leaders to develop HR strategies",
            "Drive recruitment and onboarding for key roles",
            "Manage employee relations and conflict resolution",
            "Design and implement employee engagement programs",
            "Ensure compliance with labor laws and company policies",
          ],
        },
        {
          slug: "financial-controller",
          title: "Financial Controller",
          department: "Finance",
          location: "Bangalore, India",
          type: "Full-time",
          experience: "8-12 years",
          salary_range: "₹20L - ₹35L per annum",
          description:
            "NCC is seeking a Financial Controller to oversee all financial operations. You will manage budgets, financial reporting, audits, and ensure regulatory compliance across the organization.",
          requirements: [
            "CA or CPA qualification required",
            "8+ years of experience in financial management",
            "Deep knowledge of IFRS/IndAS accounting standards",
            "Experience with ERP systems (SAP, Oracle)",
            "Strong analytical and leadership skills",
          ],
          responsibilities: [
            "Oversee financial planning, budgeting, and forecasting",
            "Prepare and present monthly and annual financial reports",
            "Manage internal and external audits",
            "Ensure compliance with tax regulations and financial standards",
            "Lead and develop the finance team",
          ],
        },
        {
          slug: "ui-ux-designer",
          title: "UI/UX Designer",
          department: "Design",
          location: "Pune, India (Hybrid)",
          type: "Full-time",
          experience: "2-5 years",
          salary_range: "₹7L - ₹15L per annum",
          description:
            "We are looking for a creative UI/UX Designer to craft intuitive and visually stunning digital experiences. You will collaborate with product and engineering teams to design user-centered interfaces for web and mobile applications.",
          requirements: [
            "Bachelor's degree in Design, HCI, or related field",
            "2+ years of experience in UI/UX design",
            "Proficiency in Figma, Sketch, or Adobe XD",
            "Strong portfolio demonstrating user-centered design work",
            "Understanding of responsive design and accessibility standards",
          ],
          responsibilities: [
            "Create wireframes, prototypes, and high-fidelity mockups",
            "Conduct user research and usability testing",
            "Collaborate with developers to implement designs",
            "Maintain and evolve the company design system",
            "Stay updated on design trends and best practices",
          ],
        },
        {
          slug: "safety-compliance-officer",
          title: "Safety & Compliance Officer",
          department: "Safety",
          location: "Multiple Locations, India",
          type: "Full-time",
          experience: "5-8 years",
          salary_range: "₹9L - ₹16L per annum",
          description:
            "NCC is hiring a Safety & Compliance Officer to ensure all project sites meet safety regulations and industry standards. You will develop safety protocols, conduct inspections, and train staff on safety practices.",
          requirements: [
            "Degree in Occupational Health & Safety or related field",
            "NEBOSH or IOSH certification required",
            "5+ years of safety management experience in construction",
            "Deep knowledge of OSHA regulations and safety standards",
            "Strong communication and training skills",
          ],
          responsibilities: [
            "Develop and implement safety policies and procedures",
            "Conduct regular site inspections and safety audits",
            "Investigate incidents and prepare detailed reports",
            "Organize safety training programs for all staff",
            "Ensure compliance with local and national safety regulations",
          ],
        },
      ];

      for (const job of jobs) {
        await pool.query(
          `INSERT INTO jobs (slug, title, department, location, type, experience, salary_range, description, requirements, responsibilities)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (slug) DO UPDATE SET
             title = EXCLUDED.title,
             department = EXCLUDED.department,
             location = EXCLUDED.location,
             type = EXCLUDED.type,
             experience = EXCLUDED.experience,
             salary_range = EXCLUDED.salary_range,
             description = EXCLUDED.description,
             requirements = EXCLUDED.requirements,
             responsibilities = EXCLUDED.responsibilities`,
          [
            job.slug,
            job.title,
            job.department,
            job.location,
            job.type,
            job.experience,
            job.salary_range,
            job.description,
            job.requirements,
            job.responsibilities,
          ]
        );
      }
      console.log(`${jobs.length} jobs seeded successfully.`);
    } else {
      console.log("Jobs already exist. Skipping seed.");
    }

    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
