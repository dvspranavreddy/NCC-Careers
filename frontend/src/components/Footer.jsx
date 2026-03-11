import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* left column - brief slogan/description */}
        <div className="footer-text">
          <p>Trusted Brand With 4 Decades Of <span className="orange">Legacy</span></p>
          <p>Building spaces where life <span className="orange">thrives!</span></p>
          <p>
            NCC Urban Infrastructure Ltd., a subsidiary of <span className="orange">NCC Limited</span>, delivers
            premium residential &amp; commercial spaces with <span className="orange">world-class</span> building
            techniques across <span className="orange">India.</span>
          </p>
        </div>

        {/* center column - quick links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><a href="https://www.nccurban.com/ongoing-projects-in-hyderabad.html" target="_blank" rel="noopener noreferrer">Our Projects</a></li>
            <li><a href="https://www.nccurban.com/testimonial.html" target="_blank" rel="noopener noreferrer">Testimonials</a></li>
            <li><a href="https://www.nccurban.com/interior.html" target="_blank" rel="noopener noreferrer">Interiors</a></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><a href="https://www.nccurban.com/faq.html" target="_blank" rel="noopener noreferrer">FAQ</a></li>
            <li><a href="https://www.nccurban.com/contactus.php" target="_blank" rel="noopener noreferrer">Contact</a></li>
            {/* contact link removed from here per request */}
          </ul>
        </div>

        {/* right column - contacts */}
        <div className="footer-links">
          <h3>Contact</h3>
          <ul className="contact">
            <li>NCC Urban Infrastructure Ltd.<br/>
                NCC House, Madhapur<br/>
                Hyderabad - 500081, Telangana
            </li>
            <li>+91 40 2326 8888</li>
            <li><a href="mailto:info@nccurban.com">info@nccurban.com</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="orange">&copy; {new Date().getFullYear()} NCC Urban Infrastructure Limited. All rights reserved.</span>
        <span className="orange">A Subsidiary of NCC Limited.</span>
      </div>
    </footer>
  )
}
