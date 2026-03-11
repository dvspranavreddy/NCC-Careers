import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* left column - brief slogan/description */}
        <div className="footer-text">
          <p>Committed to a brighter <span className="orange">world...</span></p>
          <p>Diligence can accomplish <span className="orange">wonders!</span></p>
          <p>
            For over four decades, we never sidetracked from this belief and have
            <span className="orange"> leapfrogged</span> from being just a construction industry player to a billion
            dollar <span className="orange"> multifunctional</span> infrastructure <span className="orange">conglomerate.</span>
          </p>
        </div>

        {/* center column - quick links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="https://ncclimited.com/buildings-housing.html">Expertise</Link></li>
            <li><Link to="https://ncclimited.com/quality-safety.html">Commitment</Link></li>
            <li><Link to="/https://ncclimited.com/10-years-performance.html">Investors</Link></li>
            <li><Link to="https://ncclimited.com/timeline.html">Landmarks</Link></li>
            <li><Link to="https://ncclimited.com/in-the-news.html">Media</Link></li>
            <li><a href="https://ncclimited.com/opportunities-at-ncc.html" target="_blank" rel="noopener noreferrer">Human Capital</a></li>
            {/* contact link removed from here per request */}
          </ul>
        </div>

        {/* right column - contacts */}
        <div className="footer-links">
          <h3>Contact</h3>
          <ul className="contact">
            <li>NCC House, Madhapur<br/>
                Hyderabad - 500081<br/>
                Telangana, India
            </li>
            <li>+91 40 2326 8888</li>
            <li><a href="mailto:info@nccltd.in">info@nccltd.in</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="orange">&copy; {new Date().getFullYear()} NCC Limited. All rights reserved.</span>
        <span className="orange">Built with care for a better tomorrow.</span>
      </div>
    </footer>
  )
}
