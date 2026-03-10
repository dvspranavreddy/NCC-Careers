import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiArrowLeft, HiUpload, HiCheckCircle, HiExclamation } from 'react-icons/hi'
import API from '../api'

export default function Apply() {
  const { jobSlug } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isDuplicate, setIsDuplicate] = useState(false)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: '',
  })
  const [resume, setResume] = useState(null)

  useEffect(() => {
    API.get(`/jobs/${jobSlug}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [jobSlug])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (!['pdf', 'doc', 'docx'].includes(ext)) {
        setError('Only PDF, DOC, and DOCX files are allowed')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be under 5MB')
        return
      }
      setResume(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.applicant_name || !form.applicant_email || !form.applicant_phone) {
      setError('Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.applicant_email)) {
      setError('Please enter a valid email address')
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    formData.append('job_id', job.id)
    formData.append('applicant_name', form.applicant_name)
    formData.append('applicant_email', form.applicant_email)
    formData.append('applicant_phone', form.applicant_phone)
    formData.append('cover_letter', form.cover_letter)
    if (resume) formData.append('resume', resume)

    try {
      await API.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSubmitted(true)
    } catch (err) {
      if (err.response?.status === 409) {
        setIsDuplicate(true)
        setError(err.response.data.message)
      } else {
        setError(err.response?.data?.error || 'Failed to submit application. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="loader"><div className="spinner" /></div>
  if (!job) return <div className="empty-state"><p>Job not found.</p></div>

  if (submitted) {
    return (
      <div className="apply-page">
        <div className="form-card">
          <div className="success-message">
            <div className="success-icon"><HiCheckCircle /></div>
            <h2>Application Submitted!</h2>
            <p>
              Thank you for applying for <strong>{job.title}</strong>. A confirmation email has been
              sent to <strong>{form.applicant_email}</strong>. Our team will review your application
              and reach out soon.
            </p>
            <Link to="/careers" className="btn btn-primary">Browse More Openings</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="apply-page">
      <Link to={`/jobs/${jobSlug}`} className="back-link"><HiArrowLeft /> Back to job details</Link>
      <h1>Apply for {job.title}</h1>
      <p className="subtitle">{job.department} &bull; {job.location}</p>

      {isDuplicate && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}>
          <HiExclamation style={{ color: 'var(--warning)', fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#92400e', display: 'block', marginBottom: '4px' }}>Already Applied</strong>
            <span style={{ color: '#92400e', fontSize: '0.9rem' }}>
              You have already applied for this position. You are welcome to{' '}
              <Link to="/careers" style={{ color: 'var(--primary)', fontWeight: 600 }}>explore other openings</Link>.
            </span>
          </div>
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        {!isDuplicate && error && <div className="error-msg">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>Full Name <span className="required">*</span></label>
            <input
              type="text"
              name="applicant_name"
              className="form-control"
              placeholder="John Doe"
              value={form.applicant_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address <span className="required">*</span></label>
            <input
              type="email"
              name="applicant_email"
              className="form-control"
              placeholder="john@example.com"
              value={form.applicant_email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number <span className="required">*</span></label>
          <input
            type="tel"
            name="applicant_phone"
            className="form-control"
            placeholder="+91 98765 43210"
            value={form.applicant_phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Resume</label>
          <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className="file-upload-icon"><HiUpload /></div>
            <p>Click to upload your resume (PDF, DOC, DOCX — Max 5MB)</p>
            {resume && <p className="file-name">{resume.name}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Cover Letter</label>
          <textarea
            name="cover_letter"
            className="form-control"
            placeholder="Tell us why you'd be a great fit for this role..."
            value={form.cover_letter}
            onChange={handleChange}
            rows={5}
          />
        </div>

        <button type="submit" className="btn btn-accent btn-block" disabled={submitting} style={{ padding: '14px', fontSize: '1rem' }}>
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}
