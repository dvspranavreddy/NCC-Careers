import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiDocumentText,
  HiClock,
  HiStar,
  HiBriefcase,
  HiSearch,
  HiLogout,
  HiTrash,
  HiPlus,
  HiPencil,
} from 'react-icons/hi'
import API from '../api'

const emptyJob = {
  title: '', department: '', location: '', type: 'Full-time',
  experience: '', salary_range: '', description: '',
  requirements: '', responsibilities: '',
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('applications')

  // Job form state
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [jobForm, setJobForm] = useState(emptyJob)
  const [jobSaving, setJobSaving] = useState(false)
  const [jobError, setJobError] = useState('')

  const navigate = useNavigate()
  const adminUser = localStorage.getItem('adminUser')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) { navigate('/admin/login'); return }
    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      const [appsRes, statsRes, jobsRes] = await Promise.all([
        API.get('/admin/applications'),
        API.get('/admin/stats'),
        API.get('/admin/jobs'),
      ])
      setApplications(appsRes.data)
      setStats(statsRes.data)
      setJobs(jobsRes.data)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/admin/login')
      }
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/admin/applications/${id}`, { status })
      fetchData()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleViewDetail = async (app) => {
    try {
      const res = await API.patch(`/admin/applications/${app.id}/view-detail`)
      fetchData()
      setSelectedApp(res.data)
      setShowModal(true)
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const res = await API.post(`/admin/applications/${app.id}/view`)
          fetchData()
          setSelectedApp(res.data)
          setShowModal(true)
          return
        } catch (err2) {
          console.error('Fallback view route also failed:', err2)
        }
      }
      console.error('Failed to view details:', err)
    }
  }

  const deleteApplication = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    try {
      await API.delete(`/admin/applications/${id}`)
      fetchData()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  // ── Job CRUD ──────────────────────────────────────────

  const openCreateJob = () => {
    setEditingJob(null)
    setJobForm(emptyJob)
    setJobError('')
    setShowJobModal(true)
  }

  const openEditJob = (job) => {
    setEditingJob(job)
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary_range: job.salary_range || '',
      description: job.description,
      requirements: (job.requirements || []).join('\n'),
      responsibilities: (job.responsibilities || []).join('\n'),
    })
    setJobError('')
    setShowJobModal(true)
  }

  const handleJobFormChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value })
  }

  const saveJob = async (e) => {
    e.preventDefault()
    setJobSaving(true)
    setJobError('')

    const payload = {
      ...jobForm,
      requirements: jobForm.requirements.split('\n').map(s => s.trim()).filter(Boolean),
      responsibilities: jobForm.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
    }

    try {
      if (editingJob) {
        await API.patch(`/admin/jobs/${editingJob.id}`, payload)
      } else {
        await API.post('/admin/jobs', payload)
      }
      setShowJobModal(false)
      fetchData()
    } catch (err) {
      setJobError(err.response?.data?.error || 'Failed to save job')
    } finally {
      setJobSaving(false)
    }
  }

  const toggleJobActive = async (job) => {
    try {
      await API.patch(`/admin/jobs/${job.id}`, { is_active: !job.is_active })
      fetchData()
    } catch (err) {
      console.error('Failed to toggle job:', err)
    }
  }

  const deleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job? All related applications will also be deleted.')) return
    try {
      await API.delete(`/admin/jobs/${id}`)
      fetchData()
    } catch (err) {
      console.error('Failed to delete job:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  // ── Filters ───────────────────────────────────────────

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(search.toLowerCase()) ||
      app.job_title.toLowerCase().includes(search.toLowerCase())

    let matchesStatus = statusFilter === 'all'
    if (statusFilter === 'under_review') {
      matchesStatus = app.status === 'under_review' || app.status === 'reviewed'
    } else if (statusFilter !== 'all') {
      matchesStatus = app.status === statusFilter
    }
    return matchesSearch && matchesStatus
  })

  // ── Helpers ───────────────────────────────────────────

  const renderOperationButtons = (app) => {
    const s = app.status
    if (s === 'pending') return (
      <>
        <button className="action-btn review" onClick={() => updateStatus(app.id, 'under_review')}>Review</button>
        <button className="action-btn shortlist" onClick={() => updateStatus(app.id, 'shortlisted')}>Shortlist</button>
        <button className="action-btn reject" onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
      </>
    )
    if (s === 'under_review' || s === 'reviewed') return (
      <>
        <button className="action-btn shortlist" onClick={() => updateStatus(app.id, 'shortlisted')}>Shortlist</button>
        <button className="action-btn reject" onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
      </>
    )
    if (s === 'shortlisted') return (
      <>
        <button className="action-btn accept" onClick={() => updateStatus(app.id, 'accepted')}>Accept</button>
        <button className="action-btn reject" onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
      </>
    )
    return null
  }

  const getStatusLabel = (status) => {
    const map = { under_review: 'Under Review', reviewed: 'Under Review', pending: 'Pending', shortlisted: 'Shortlisted', accepted: 'Accepted', rejected: 'Rejected' }
    return map[status] || status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) return <div className="loader"><div className="spinner" /></div>

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-info">
          <span>Welcome, <strong>{adminUser}</strong></span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}><HiLogout /> Logout</button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card blue"><div className="stat-icon blue"><HiDocumentText /></div><div className="stat-details"><h3>{stats.totalApplications}</h3><p>Total Applications</p></div></div>
          <div className="stat-card orange"><div className="stat-icon orange"><HiClock /></div><div className="stat-details"><h3>{stats.pendingApplications}</h3><p>Pending Review</p></div></div>
          <div className="stat-card blue"><div className="stat-icon blue"><HiClock /></div><div className="stat-details"><h3>{stats.underReviewApplications}</h3><p>Under Review</p></div></div>
          <div className="stat-card green"><div className="stat-icon green"><HiStar /></div><div className="stat-details"><h3>{stats.shortlistedApplications}</h3><p>Shortlisted</p></div></div>
          <div className="stat-card green"><div className="stat-icon green"><HiBriefcase /></div><div className="stat-details"><h3>{stats.acceptedApplications}</h3><p>Accepted</p></div></div>
          <div className="stat-card purple"><div className="stat-icon purple"><HiBriefcase /></div><div className="stat-details"><h3>{stats.activeJobs}</h3><p>Active Jobs</p></div></div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="dash-tabs">
        <button className={`dash-tab ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
          <HiDocumentText /> Applications
        </button>
        <button className={`dash-tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          <HiBriefcase /> Manage Jobs
        </button>
      </div>

      {/* ═══ APPLICATIONS TAB ═══ */}
      {activeTab === 'applications' && (
        <div className="table-card">
          <div className="table-header">
            <h2>Applications ({filteredApps.length})</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="filter-bar" style={{ margin: 0 }}>
                {['all', 'pending', 'under_review', 'shortlisted', 'accepted', 'rejected'].map((s) => (
                  <button key={s} className={`filter-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                    {s === 'all' ? 'All' : s === 'under_review' ? 'Under Review' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="search-box">
                <HiSearch />
                <input type="text" placeholder="Search applications..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📭</div><p>No applications found.</p></div>
          ) : (
            <div className="table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Applicant</th><th>View Detail</th><th>Email Sent</th><th>Position</th><th>Department</th><th>Date</th><th>Status</th><th>Operations</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div>
                          <strong>{app.applicant_name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{app.applicant_email}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-lighter)' }}>{app.applicant_phone}</div>
                        </div>
                      </td>
                      <td>
                        <button className="view-detail-btn" onClick={() => handleViewDetail(app)}
                          title={app.view_detail_clicked ? 'View details (email already sent)' : 'View details (will send email & set status to Under Review)'}>
                          View Detail
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>{app.email_sent ? 'sent' : '-'}</td>
                      <td>{app.job_title}</td>
                      <td>{app.department}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td><span className={`status-badge ${app.status === 'reviewed' ? 'under_review' : app.status}`}>{getStatusLabel(app.status)}</span></td>
                      <td><div className="action-btns">{renderOperationButtons(app)}</div></td>
                      <td><button className="action-btn delete" onClick={() => deleteApplication(app.id)} title="Delete application"><HiTrash /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══ JOBS TAB ═══ */}
      {activeTab === 'jobs' && (
        <div className="table-card">
          <div className="table-header">
            <h2>Job Listings ({jobs.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={openCreateJob}><HiPlus /> Create New Job</button>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">💼</div><p>No job listings yet. Create your first one!</p></div>
          ) : (
            <div className="table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Experience</th><th>Status</th><th>Created</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td><strong>{job.title}</strong></td>
                      <td>{job.department}</td>
                      <td>{job.location}</td>
                      <td>{job.type}</td>
                      <td>{job.experience}</td>
                      <td>
                        <span className={`status-badge ${job.is_active ? 'accepted' : 'rejected'}`} style={{ cursor: 'pointer' }} onClick={() => toggleJobActive(job)} title="Click to toggle">
                          {job.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn review" onClick={() => openEditJob(job)} title="Edit job"><HiPencil /></button>
                          <button className="action-btn delete" onClick={() => deleteJob(job.id)} title="Delete job"><HiTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══ APPLICATION DETAIL MODAL ═══ */}
      {showModal && selectedApp && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-detail" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>

            <div className="modal-detail-header">
              <div className="modal-avatar">{selectedApp.applicant_name.charAt(0).toUpperCase()}</div>
              <div>
                <h2>{selectedApp.applicant_name}</h2>
                <p className="modal-subtitle">{selectedApp.job_title} &middot; {selectedApp.department}</p>
              </div>
              <span className={`status-badge ${selectedApp.status === 'reviewed' ? 'under_review' : selectedApp.status}`} style={{ marginLeft: 'auto' }}>
                {getStatusLabel(selectedApp.status)}
              </span>
            </div>

            <div className="modal-detail-body">
              <div className="modal-detail-grid">
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Email</span>
                  <span className="modal-detail-value">{selectedApp.applicant_email}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Phone</span>
                  <span className="modal-detail-value">{selectedApp.applicant_phone}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Position</span>
                  <span className="modal-detail-value">{selectedApp.job_title}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Department</span>
                  <span className="modal-detail-value">{selectedApp.department}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Applied On</span>
                  <span className="modal-detail-value">
                    {new Date(selectedApp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Email Sent</span>
                  <span className="modal-detail-value">{selectedApp.email_sent ? 'sent' : '-'}</span>
                </div>
              </div>

              {selectedApp.cover_letter && (
                <div className="modal-detail-section">
                  <h4>Cover Letter</h4>
                  <p>{selectedApp.cover_letter}</p>
                </div>
              )}

              {selectedApp.resume_path && (
                <div className="modal-detail-section">
                  <h4>Resume</h4>
                  <a
                    className="btn btn-primary btn-sm"
                    href={`${API.defaults.baseURL.replace('/api', '')}/uploads/${selectedApp.resume_path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📄 View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ JOB CREATE / EDIT MODAL ═══ */}
      {showJobModal && (
        <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
          <div className="modal-content modal-job-form" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowJobModal(false)}>&times;</button>
            <h2>{editingJob ? 'Edit Job' : 'Create New Job'}</h2>

            {jobError && <div className="error-msg">{jobError}</div>}

            <form onSubmit={saveJob}>
              <div className="form-row">
                <div className="form-group">
                  <label>Job Title <span className="required">*</span></label>
                  <input className="form-control" name="title" value={jobForm.title} onChange={handleJobFormChange} required />
                </div>
                <div className="form-group">
                  <label>Department <span className="required">*</span></label>
                  <input className="form-control" name="department" value={jobForm.department} onChange={handleJobFormChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location <span className="required">*</span></label>
                  <input className="form-control" name="location" value={jobForm.location} onChange={handleJobFormChange} required />
                </div>
                <div className="form-group">
                  <label>Job Type <span className="required">*</span></label>
                  <select className="form-control" name="type" value={jobForm.type} onChange={handleJobFormChange} required>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Experience <span className="required">*</span></label>
                  <input className="form-control" name="experience" value={jobForm.experience} onChange={handleJobFormChange} placeholder="e.g. 2-4 years" required />
                </div>
                <div className="form-group">
                  <label>Salary Range</label>
                  <input className="form-control" name="salary_range" value={jobForm.salary_range} onChange={handleJobFormChange} placeholder="e.g. ₹6L - ₹10L" />
                </div>
              </div>
              <div className="form-group">
                <label>Description <span className="required">*</span></label>
                <textarea className="form-control" name="description" value={jobForm.description} onChange={handleJobFormChange} rows={3} required />
              </div>
              <div className="form-group">
                <label>Requirements <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(one per line)</span></label>
                <textarea className="form-control" name="requirements" value={jobForm.requirements} onChange={handleJobFormChange} rows={4} placeholder="Bachelor's degree in CS&#10;2+ years experience&#10;Strong communication skills" />
              </div>
              <div className="form-group">
                <label>Responsibilities <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(one per line)</span></label>
                <textarea className="form-control" name="responsibilities" value={jobForm.responsibilities} onChange={handleJobFormChange} rows={4} placeholder="Design and develop features&#10;Collaborate with team&#10;Write clean code" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowJobModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={jobSaving}>
                  {jobSaving ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}