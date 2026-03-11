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
} from 'react-icons/hi'
import API from '../api'

export default function AdminDashboard() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const adminUser = localStorage.getItem('adminUser')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        API.get('/admin/applications'),
        API.get('/admin/stats'),
      ])
      setApplications(appsRes.data)
      setStats(statsRes.data)
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

  // Called when "View Detail" button is clicked
  // - First click: backend sends email + changes status to under_review
  // - Subsequent clicks: just opens modal, no email, no status change
  const handleViewDetail = async (app) => {
    try {
      // preferred new endpoint (PATCH)
      const res = await API.patch(`/admin/applications/${app.id}/view-detail`)
      fetchData() // refresh table so status + action buttons update
      setSelectedApp(res.data)
      setShowModal(true)
    } catch (err) {
      // If the deployed backend hasn't been updated yet it may still use the
      // old POST /view route.  In that case the patch will return 404.
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(search.toLowerCase()) ||
      app.job_title.toLowerCase().includes(search.toLowerCase())

    let matchesStatus = false
    if (statusFilter === 'all') {
      matchesStatus = true
    } else if (statusFilter === 'under_review') {
      matchesStatus = app.status === 'under_review' || app.status === 'reviewed'
    } else {
      matchesStatus = app.status === statusFilter
    }

    return matchesSearch && matchesStatus
  })

  // Helper: renders the correct action buttons based on current status
  // Rules:
  //   pending        → Review | Shortlist | Reject
  //   under_review   → Shortlist | Reject  (NO Review button)
  //   shortlisted    → Accept | Reject     (NO Shortlist button)
  //   accepted       → (no buttons)
  //   rejected       → (no buttons)
  const renderOperationButtons = (app) => {
    const status = app.status

    if (status === 'pending') {
      return (
        <>
          <button
            className="action-btn review"
            onClick={() => updateStatus(app.id, 'under_review')}
          >
            Review
          </button>
          <button
            className="action-btn shortlist"
            onClick={() => updateStatus(app.id, 'shortlisted')}
          >
            Shortlist
          </button>
          <button
            className="action-btn reject"
            onClick={() => updateStatus(app.id, 'rejected')}
          >
            Reject
          </button>
        </>
      )
    }

    if (status === 'under_review' || status === 'reviewed') {
      // Review button is intentionally REMOVED here
      return (
        <>
          <button
            className="action-btn shortlist"
            onClick={() => updateStatus(app.id, 'shortlisted')}
          >
            Shortlist
          </button>
          <button
            className="action-btn reject"
            onClick={() => updateStatus(app.id, 'rejected')}
          >
            Reject
          </button>
        </>
      )
    }

    if (status === 'shortlisted') {
      return (
        <>
          <button
            className="action-btn accept"
            onClick={() => updateStatus(app.id, 'accepted')}
          >
            Accept
          </button>
          <button
            className="action-btn reject"
            onClick={() => updateStatus(app.id, 'rejected')}
          >
            Reject
          </button>
        </>
      )
    }

    // accepted or rejected → no operation buttons
    return null
  }

  // Helper: display label for status badge
  const getStatusLabel = (status) => {
    switch (status) {
      case 'under_review':
      case 'reviewed':
        return 'Under Review'
      case 'pending':
        return 'Pending'
      case 'shortlisted':
        return 'Shortlisted'
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Rejected'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  if (loading) return <div className="loader"><div className="spinner" /></div>

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-info">
          <span>Welcome, <strong>{adminUser}</strong></span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            <HiLogout /> Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><HiDocumentText /></div>
            <div className="stat-details">
              <h3>{stats.totalApplications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><HiClock /></div>
            <div className="stat-details">
              <h3>{stats.pendingApplications}</h3>
              <p>Pending Review</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><HiClock /></div>
            <div className="stat-details">
              <h3>{stats.underReviewApplications}</h3>
              <p>Under Review</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><HiStar /></div>
            <div className="stat-details">
              <h3>{stats.shortlistedApplications}</h3>
              <p>Shortlisted</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><HiBriefcase /></div>
            <div className="stat-details">
              <h3>{stats.acceptedApplications}</h3>
              <p>Accepted</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><HiBriefcase /></div>
            <div className="stat-details">
              <h3>{stats.activeJobs}</h3>
              <p>Active Jobs</p>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="table-card">
        <div className="table-header">
          <h2>Applications ({filteredApps.length})</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="filter-bar" style={{ margin: 0 }}>
              {/* Filter tabs — includes "Accepted" tab */}
              {['all', 'pending', 'under_review', 'shortlisted', 'accepted', 'rejected'].map((s) => (
                <button
                  key={s}
                  className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  {s === 'all'
                    ? 'All'
                    : s === 'under_review'
                    ? 'Under Review'
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="search-box">
              <HiSearch />
              <input
                type="text"
                placeholder="Search applications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No applications found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  {/* Column order: Applicant | View Detail | Email Sent | Position | Department | Date | Status | Operations | Actions(delete) */}
                  <th>Applicant</th>
                  <th>View Detail</th>
                  <th>Email Sent</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Operations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id}>

                    {/* 1. Applicant info */}
                    <td>
                      <div>
                        <strong>{app.applicant_name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          {app.applicant_email}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-lighter)' }}>
                          {app.applicant_phone}
                        </div>
                      </div>
                    </td>

                    {/* 2. View Detail — email goes on first click only, status changes on first click only */}
                    <td>
                      <button
                        className="view-detail-btn"
                        onClick={() => handleViewDetail(app)}
                        title={
                          app.view_detail_clicked
                            ? 'View details (email already sent)'
                            : 'View details (will send email & set status to Under Review)'
                        }
                      >
                        View Detail
                      </button>
                    </td>
                    {/* 3. Email sent indicator */}
                    <td style={{ textAlign: 'center' }}>
                      {app.email_sent ? '✅' : '–'}
                    </td>

                    {/* 3. Position */}
                    <td>{app.job_title}</td>

                    {/* 4. Department */}
                    <td>{app.department}</td>

                    {/* 5. Date */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(app.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* 6. Status badge */}
                    <td>
                      <span className={`status-badge ${app.status === 'reviewed' ? 'under_review' : app.status}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>

                    {/* 7. Operations — dynamic buttons based on status rules */}
                    <td>
                      <div className="action-btns">
                        {renderOperationButtons(app)}
                      </div>
                    </td>

                    {/* 8. Actions — delete icon only */}
                    <td>
                      <button
                        className="action-btn delete"
                        onClick={() => deleteApplication(app.id)}
                        title="Delete application"
                      >
                        <HiTrash />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {/* Application Detail Modal */}
{showModal && selectedApp && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setShowModal(false)}>
        &times;
      </button>

      <h2>Application Details</h2>

      <div className="form-view">

        <div className="form-group">
          <label>Name</label>
          <input type="text" value={selectedApp.applicant_name} readOnly />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="text" value={selectedApp.applicant_email} readOnly />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="text" value={selectedApp.applicant_phone} readOnly />
        </div>

        <div className="form-group">
          <label>Position Applied</label>
          <input type="text" value={selectedApp.job_title} readOnly />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input type="text" value={selectedApp.department} readOnly />
        </div>

        {selectedApp.cover_letter && (
          <div className="form-group">
            <label>Cover Letter</label>
            <textarea value={selectedApp.cover_letter} readOnly />
          </div>
        )}

        {selectedApp.resume_path && (
          <div className="form-group">
            <label>Resume</label>
            <a
              className="resume-btn"
              href={`${API.defaults.baseURL.replace('/api', '')}/uploads/${selectedApp.resume_path}`}
              target="_blank"
              rel="noreferrer"
            >
              View Resume
            </a>
          </div>
        )}

        <div className="form-group">
          <label>Status</label>
          <input type="text" value={selectedApp.status} readOnly />
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  )
}