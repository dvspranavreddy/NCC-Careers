import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiLocationMarker, HiBriefcase, HiClock, HiArrowLeft } from 'react-icons/hi'
import API from '../api'

export default function JobDetail() {
  const { slug } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/jobs/${slug}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error('Failed to fetch job:', err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="loader"><div className="spinner" /></div>
  if (!job) return <div className="empty-state"><p>Job not found.</p></div>

  return (
    <div className="job-detail">
      <Link to="/careers" className="back-link"><HiArrowLeft /> Back to all openings</Link>

      <div className="job-detail-header">
        <div className="job-detail-tags">
          <span className="tag"><HiBriefcase /> {job.department}</span>
          <span className="tag"><HiLocationMarker /> {job.location}</span>
          <span className="tag"><HiClock /> {job.type}</span>
          <span className="tag">{job.experience}</span>
        </div>
        <h1>{job.title}</h1>
        <div className="job-detail-header-row">
          {job.salary_range && <div className="job-detail-salary">{job.salary_range}</div>}
          <Link to={`/apply/${job.slug}`} className="btn btn-accent">
            Apply Now
          </Link>
        </div>
      </div>

      <div className="job-detail-section">
        <h2>About the Role</h2>
        <p>{job.description}</p>
      </div>

      <div className="job-detail-section">
        <h2>Requirements</h2>
        <ul>
          {job.requirements?.map((req, i) => <li key={i}>{req}</li>)}
        </ul>
      </div>

      <div className="job-detail-section">
        <h2>Responsibilities</h2>
        <ul>
          {job.responsibilities?.map((resp, i) => <li key={i}>{resp}</li>)}
        </ul>
      </div>

      <div className="job-detail-apply">
        <h3>Interested in this role?</h3>
        <p>Submit your application and take the first step towards an exciting career at NCC.</p>
        <Link to={`/apply/${job.slug}`} className="btn btn-accent" style={{ padding: '14px 40px', fontSize: '1rem' }}>
          Apply for this Position
        </Link>
      </div>
    </div>
  )
}
