import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiLocationMarker, HiBriefcase, HiClock, HiCurrencyRupee } from 'react-icons/hi'
import API from '../api'

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    API.get('/jobs')
      .then((res) => setJobs(res.data))
      .catch((err) => console.error('Failed to fetch jobs:', err))
      .finally(() => setLoading(false))
  }, [])

  const departments = ['All', ...new Set(jobs.map((j) => j.department))]
  const filtered = filter === 'All' ? jobs : jobs.filter((j) => j.department === filter)

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Build Your Future with <span>NCC</span>
          </h1>
          <p>
            Join one of India's leading infrastructure companies. Explore exciting
            career opportunities and grow with a team that builds tomorrow.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="number">{jobs.length}+</div>
              <div className="label">Open Positions</div>
            </div>
            <div className="hero-stat">
              <div className="number">45+</div>
              <div className="label">Years of Excellence</div>
            </div>
            <div className="hero-stat">
              <div className="number">10K+</div>
              <div className="label">Team Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="section">
        <div className="section-header">
          <h2>Current Openings</h2>
          <p>Discover roles that match your skills and aspirations. We're always looking for talented individuals to join the NCC family.</p>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`filter-btn ${filter === dept ? 'active' : ''}`}
              onClick={() => setFilter(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No open positions in this category right now.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filtered.map((job) => (
              <div className="job-card" key={job.id}>
                <div className="job-card-header">
                  <span className="job-card-dept">{job.department}</span>
                  <span className="job-card-type">{job.type}</span>
                </div>
                <h3>{job.title}</h3>
                <div className="job-card-meta">
                  <span><HiLocationMarker /> {job.location}</span>
                  <span><HiBriefcase /> {job.experience}</span>
                  {job.salary_range && <span><HiCurrencyRupee /> {job.salary_range}</span>}
                </div>
                <p>{job.description}</p>
                <div className="job-card-actions">
                  <Link to={`/jobs/${job.slug}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                    View Details
                  </Link>
                  <Link to={`/apply/${job.slug}`} className="btn btn-accent btn-sm" style={{ flex: 1 }}>
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
