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
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
            <div className="stat-icon green"><HiStar /></div>
            <div className="stat-details">
              <h3>{stats.shortlistedApplications}</h3>
              <p>Shortlisted</p>
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
              {['all', 'pending', 'reviewed', 'shortlisted', 'rejected'].map((s) => (
                <button
                  key={s}
                  className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
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
                  <th>Applicant</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id}>
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
                    <td>{app.job_title}</td>
                    <td>{app.department}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(app.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span className={`status-badge ${app.status}`}>{app.status}</span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {app.status !== 'reviewed' && (
                          <button className="action-btn review" onClick={() => updateStatus(app.id, 'reviewed')}>
                            Review
                          </button>
                        )}
                        {app.status !== 'shortlisted' && (
                          <button className="action-btn shortlist" onClick={() => updateStatus(app.id, 'shortlisted')}>
                            Shortlist
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button className="action-btn reject" onClick={() => updateStatus(app.id, 'rejected')}>
                            Reject
                          </button>
                        )}
                        <button className="action-btn delete" onClick={() => deleteApplication(app.id)}>
                          <HiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
