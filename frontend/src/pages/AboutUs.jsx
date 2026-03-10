import { Link } from 'react-router-dom'
import {
  HiOfficeBuilding,
  HiUserGroup,
  HiGlobe,
  HiLocationMarker,
  HiPhone,
  HiMail,
} from 'react-icons/hi'

const boardMembers = [
  {
    name: 'Adinarayana Nareddy',
    title: 'Chairman & Managing Director',
    bio: 'Over 35 years of leadership in infrastructure development, steering NCC to become one of India foremost construction conglomerates.',
    initials: 'AN',
  },
  {
    name: 'Rajesh Kumar',
    title: 'Executive Director – Operations',
    bio: 'Leads end-to-end project delivery across roads, buildings, and water infrastructure with a focus on quality and safety.',
    initials: 'RK',
  },
  {
    name: 'Supriya Sharma',
    title: 'Chief Financial Officer',
    bio: 'Drives financial strategy, investor relations, and governance with deep expertise in infrastructure finance.',
    initials: 'SS',
  },
  {
    name: 'Vikram Mehta',
    title: 'Chief Technology Officer',
    bio: 'Champions digital transformation, BIM adoption, and smart construction technologies across NCC projects.',
    initials: 'VM',
  },
  {
    name: 'Anitha Reddy',
    title: 'Chief Human Resources Officer',
    bio: 'Builds world-class talent programmes, culture initiatives, and leadership pipelines for NCCs 10,000+ workforce.',
    initials: 'AR',
  },
  {
    name: 'Sanjay Pillai',
    title: 'Independent Director',
    bio: 'Brings vast experience in corporate governance, risk management, and strategic advisory to the NCC board.',
    initials: 'SP',
  },
]

const offices = [
  {
    city: 'Hyderabad',
    label: 'Head Office',
    address: 'NCC House, Madhapur, Hyderabad, Telangana 500081',
    phone: '+91 40 2326 8888',
    email: 'info@ncc.co.in',
  },
  {
    city: 'Mumbai',
    label: 'Western Region',
    address: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    phone: '+91 22 6180 6000',
    email: 'mumbai@ncc.co.in',
  },
  {
    city: 'Delhi NCR',
    label: 'Northern Region',
    address: 'Sector 44, Gurugram, Haryana 122003',
    phone: '+91 124 456 7890',
    email: 'delhi@ncc.co.in',
  },
  {
    city: 'Bangalore',
    label: 'Southern Region',
    address: 'Whitefield, Bangalore, Karnataka 560066',
    phone: '+91 80 4567 8900',
    email: 'bangalore@ncc.co.in',
  },
  {
    city: 'Chennai',
    label: 'South-East Region',
    address: 'Nungambakkam, Chennai, Tamil Nadu 600034',
    phone: '+91 44 2345 6789',
    email: 'chennai@ncc.co.in',
  },
  {
    city: 'Kolkata',
    label: 'Eastern Region',
    address: 'Salt Lake City, Kolkata, West Bengal 700091',
    phone: '+91 33 2222 3333',
    email: 'kolkata@ncc.co.in',
  },
]

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About <span>NCC</span></h1>
          <p>
            Building India's future for over 50 years. From highways and airports to smart cities
            and water infrastructure — NCC shapes the landscape of a growing nation.
          </p>
          <div className="about-hero-actions">
            <Link to="/" className="btn btn-accent">View Open Positions</Link>
          </div>
        </div>
      </section>

      {/* Tabs / Anchor Nav */}
      <nav className="about-subnav">
        <a href="#about">About Us</a>
        <a href="#offices">Our Office Locations</a>
        <a href="#board">Our Board &amp; Executive Committee</a>
      </nav>

      {/* About Us */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="section-header" style={{ textAlign: 'left' }}>
            <h2>About Us</h2>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>
                NCC Limited is one of India's largest and most respected infrastructure and
                construction companies, with a track record spanning over five decades. We deliver
                complex projects across roads &amp; highways, buildings, water &amp; environment,
                electrical, railways, and mining sectors.
              </p>
              <p>
                Headquartered in Hyderabad, NCC operates across India and internationally with a
                workforce of over 10,000 professionals and an annual order book exceeding ₹50,000
                crore. Our commitment to quality, safety, and sustainability drives every project
                we undertake.
              </p>
              <p>
                At NCC, we believe our people are our greatest asset. We invest in talent,
                foster innovation, and provide careers where professionals can do their best work
                on projects that truly matter.
              </p>
            </div>
            <div className="about-stats-panel">
              <div className="about-stat">
                <span className="about-stat-num">50+</span>
                <span className="about-stat-label">Years of Excellence</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">10K+</span>
                <span className="about-stat-label">Employees</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">₹50K Cr</span>
                <span className="about-stat-label">Order Book</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">20+</span>
                <span className="about-stat-label">States &amp; Territories</span>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="values-grid">
            {[
              { icon: '🏗️', title: 'Quality First', desc: 'Every project delivered to the highest standards of engineering excellence.' },
              { icon: '🌱', title: 'Sustainability', desc: 'Building green with responsible sourcing and eco-friendly practices.' },
              { icon: '🤝', title: 'Integrity', desc: 'Transparent, ethical, and accountable in all our dealings.' },
              { icon: '💡', title: 'Innovation', desc: 'Embracing technology and new methods to build smarter and faster.' },
            ].map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-icon">{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section id="offices" className="about-section about-section-alt">
        <div className="about-container">
          <div className="section-header" style={{ textAlign: 'left' }}>
            <h2>Our Office Locations</h2>
            <p style={{ marginLeft: 0 }}>With offices across India, NCC is always close to where the action is.</p>
          </div>
          <div className="offices-grid">
            {offices.map((office) => (
              <div className="office-card" key={office.city}>
                <div className="office-card-header">
                  <HiOfficeBuilding />
                  <div>
                    <h3>{office.city}</h3>
                    <span className="office-label">{office.label}</span>
                  </div>
                </div>
                <ul className="office-details">
                  <li><HiLocationMarker /><span>{office.address}</span></li>
                  <li><HiPhone /><span>{office.phone}</span></li>
                  <li><HiMail /><span>{office.email}</span></li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board & Executive Committee */}
      <section id="board" className="about-section">
        <div className="about-container">
          <div className="section-header" style={{ textAlign: 'left' }}>
            <h2>Our Board &amp; Executive Committee</h2>
            <p style={{ marginLeft: 0 }}>Experienced leaders guiding NCC's vision, strategy, and growth.</p>
          </div>
          <div className="board-grid">
            {boardMembers.map((member) => (
              <div className="board-card" key={member.name}>
                <div className="board-avatar">{member.initials}</div>
                <div className="board-info">
                  <h3>{member.name}</h3>
                  <span className="board-title">{member.title}</span>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
