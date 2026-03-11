import { useState } from 'react'

export default function Gate({ onUnlock }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code === 'ncc-career') {
      sessionStorage.setItem('site_unlocked', 'true')
      onUnlock()
    } else {
      setError('Invalid access code. Please try again.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="gate-overlay">
      <div className={`gate-card${shake ? ' gate-shake' : ''}`}>
        <div className="gate-icon">🔒</div>
        <h1>Restricted Access</h1>
        <p>This site is for authorized reviewers only. Please enter the access code to continue.</p>

        {error && <div className="gate-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="gate-input"
            type="password"
            placeholder="Enter access code"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError('') }}
            autoFocus
          />
          <button className="gate-btn" type="submit">Unlock</button>
        </form>
      </div>
    </div>
  )
}
