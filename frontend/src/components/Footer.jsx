import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <ul>
            <li><a href="https://www.nccgroupplc.com/investor-relations/" target="_blank" rel="noopener noreferrer">Investor Relations</a></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><a href="https://www.nccgroup.com/newsroom/" target="_blank" rel="noopener noreferrer">Newsroom</a></li>
            <li><Link to="/about#offices" onClick={() => setTimeout(() => document.getElementById('offices')?.scrollIntoView({ behavior: 'smooth' }), 100)}>Our Office Locations</Link></li>
            <li><a href="https://www.nccgroupplc.com/contact-us/">Contact Us</a></li>
            <li><a href="https://www.nccgroupplc.com/emergency-cyber-incident-hotline/">Emergency Cyber Incident Hotline</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <ul>
            <li><a href="https://www.nccgroupplc.com/terms-conditions/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a></li>
            <li><a href="https://www.nccgroupplc.com/privacy-notice/" target="_blank" rel="noopener noreferrer">Privacy Notice</a></li>
            <li><a href="https://www.nccgroupplc.com/privacy-notice/cookie-policy/" target="_blank" rel="noopener noreferrer">Cookie Policy</a></li>
            <li><a href="/candidate-privacy-notice.pdf" target="_blank" rel="noopener noreferrer">Candidate Privacy Notice</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} NCC Limited. All rights reserved.</span>
        <span>Built with care for a better tomorrow.</span>
      </div>
    </footer>
  )
}
