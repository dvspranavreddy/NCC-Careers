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
    name: 'Dr. A S Durga Prasad',
    title: 'Independent Director - Chairman',
    bio: 'Dr. Durga Prasad is a seasoned executive with over four decades of experience in Financial and Cost Management, across diverse sectors such as Pharmaceuticals, Infrastructure, IT and Discrete Manufacturing.He holds a Bachelor’s degree in Commerce, is a Fellow Member of the Institute of Cost and Works Accountants of India and has earned a PhD. He has been associated with Academic Institutions such as universities, colleges and others in different capacities.',
    initials: 'DP',
  },
  {
    name: 'Mr. Rajender Mohan Malla',
    title: 'Independent Director',
    bio: 'Mr. R M Malla brings over four decades of experience in banking and finance. His leadership roles include Chairman and MD of IDBI Bank and SIDBI, CEO of IFCI, and MD & CEO of PTC India Financial Services Ltd. He currently serves on the board of several leading companies.He holds an MBA from the Faculty of Management Studies, University of Delhi, a PGDBM from MDI Gurgaon, and is a Certified Associate of the Indian Institute of Bankers.',
    initials: 'RM',
  },
  {
    name: 'Mrs. Uma Shankar',
    title: 'Independent Director',
    bio: 'Mrs. Uma Shankar has nearly four decades of experience in the financial sector, particularly in Banking Supervision, Currency Management, Urban Banks Regulation and Administration. She held various senior roles at RBI, including its Executive Director and was nominated to the Boards of reputed institutions and banks.She holds a Post Graduate degree in English, is a Certified Associate of the Indian Institute of Bankers and has completed Executive Education at Columbia Business School, New York.',
    initials: 'US',
  },
  {
    name: 'Mr. Ramesh Kailasam',
    title: 'Independent Director',
    bio: 'Mr. Ramesh Kailasam is a Cost Accountant with nearly three decades of multi-sectoral experience. His core competencies include governance reforms, public policy, leadership, strategy and government engagement. He has authored numerous reports and publications which have been used by governments, industry bodies, think tanks and international agencies.He is the CEO of IndiaTech.org, an industry association representing India’s consumer internet start-ups, unicorns and investors.',
    initials: 'RK',
  },
  {
    name: 'Mr. Sumit Banerjee',
    title: 'Independent Director',
    bio: 'Mr. Sumit Banerjee has over four decades of experience in management and leadership roles. He served at Management levels with renowned corporates namely ACC, Reliance, Hindalco and L&T. He is a recipient of the Corporate Citizen award at the CNBC-TV18 Indian Business Leader Awards - 2009.He holds a bachelor’s degree in technology from IIT, Kharagpur. He has also completed the ‘Leading Change and Organizational Renewal’ programme from Harvard Business School and management education programme from IIM, Ahmedabad.',
    initials: 'SB',
  },
  {
    name: 'Mr. Utpal Sheth',
    title: 'Director',
    bio: 'Mr. Utpal Sheth brings over three decades of experience in financial investments and capital markets including fundraising, mergers & acquisitions, and corporate advisory. Formerly, the CEO and Senior Partner at Rare Enterprises - founded by late Sri Rakesh Jhunjhunwala.He is a qualified Cost Accountant, a CFA and holds a Diploma in Systems Management from NIIT. He is the Founder and Mentor of the TRUST Group, an Institutionalized Multi-Line and Multi-Asset Financial Services Platform.',
    initials: 'US',
  },
  {
    name: 'Mr. A A V Ranga Raju',
    title: 'Managing Director',
    bio: 'Mr. Ranga Raju has four decades of experience in Construction, Infrastructure Development and allied fields. Mr. Ranga Raju, joined the family business at a very early age, soon after completing his education. He has been the MD of the company for more than three decades and has been instrumental in propelling the company ahead.',
    initials: 'AR',
  },
  {
    name: 'Mr. A G K Raju',
    title: 'Executive Director',
    bio: 'Mr. A G K Raju has experience of four decades in Construction, Finance, Materials Management, Administration, HR, Corporate Communications and allied areas. It is his leadership that has helped steer the company’s operations to make it more efficient and smart.Mr. A G K Raju holds an MBA post-graduate degree from Pune University.',
    initials: 'AK',
  },
  {
    name: 'Mr. A S N Raju',
    title: 'Wholetime Director',
    bio: 'Mr. A S N Raju’s valuable experience of four decades in the construction industry is a formidable asset to the company. His execution capabilities of projects are commendable. His current responsibilities include overseeing the Buildings Division and CSR activities at NCC.',
    initials: 'AN',
  },
  {
    name: 'Mr. J V Ranga Raju',
    title: 'Wholetime Director',
    bio: 'Mr. J V Ranga Raju has been associated with the Construction Industry for four decades. His rich experience has been instrumental in turning the company into one of the largest construction companies in India in the vast and fast-changing scenario. He has business interests in the Hospitality and Education fields.',
    initials: 'JR',
  },
  {
    name: 'Mr. A V N Raju',
    title: 'Wholetime Director',
    bio: 'Mr. A V N Raju has gained a wealth of knowledge through close to four decades of experience in the construction industry. With his commitment and diligence, he leads the operations of the Electrical and Irrigation Divisions of the company.',
    initials: 'AV',
  },
]

const offices = [
  {
    city: 'Hyderabad',
    label: 'Head Office',
    address: 'NCC House, Madhapur, Hyderabad, Telangana 500081',
    phone: '+91 40 2326 8888',
    email: 'info@nccurban.com',
  },
  {
    city: 'Bengaluru',
    label: 'Regional Office',
    address: 'Bengaluru, Karnataka',
    phone: '+91 80 2225 8991',
    email: 'bangalore@nccurban.com',
  },
  {
    city: 'Chennai',
    label: 'Regional Office',
    address: 'Chennai, Tamil Nadu',
    phone: '+91 44 2815 0000',
    email: 'chennai@nccurban.com',
  },
  {
    city: 'Kochi',
    label: 'Regional Office',
    address: 'Kochi, Kerala',
    phone: '+91 484 235 0000',
    email: 'kochi@nccurban.com',
  },
  {
    city: 'Ranchi',
    label: 'Regional Office',
    address: 'Ranchi, Jharkhand',
    phone: '+91 651 220 0000',
    email: 'ranchi@nccurban.com',
  },
  {
    city: 'Guntur',
    label: 'Regional Office',
    address: 'Guntur, Andhra Pradesh',
    phone: '+91 863 222 0000',
    email: 'guntur@nccurban.com',
  },
]

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About <span>NCC Urban</span></h1>
          <p>
            A trusted brand with 4 decades of legacy. From premium residences and villas to
            townships and commercial complexes — NCC Urban builds spaces where life thrives.
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
                NCC Urban Infrastructure Ltd. is a Subsidiary of NCC Limited and comes equipped
                with world-class building techniques and state-of-the-art building infrastructure
                that is expertly commandeered by top-notch professionals.
              </p>
              <p>
                NCC Urban's quality operations span across Residential and Commercial complexes,
                Villas, Row-Houses, Residential Layouts, Townships, SEZ's and Serviced Apartment
                complexes. With more than 40 completed projects and the highest customer
                satisfaction, NCC Urban is one of the most trusted brands in Indian real estate.
              </p>
              <p>
                The company has an impressive pan-India presence across Bengaluru, Hyderabad,
                Chennai, Kochi, Guntur and Ranchi. NCC Urban has inherited its experience and
                expertise from NCC Limited, a leading infrastructure company with more than
                4 decades of expertise.
              </p>
            </div>
            <div className="about-stats-panel">
              <div className="about-stat">
                <span className="about-stat-num">46+</span>
                <span className="about-stat-label">Years in Industry</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">44+</span>
                <span className="about-stat-label">Successful Projects</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">11.7M</span>
                <span className="about-stat-label">Sq. Ft. Delivered</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">10K+</span>
                <span className="about-stat-label">Happy Families</span>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="values-grid">
            {[
              { icon: '🏗️', title: 'Quality First', desc: 'ISO 9001-14001-18001 certified — every project built to the highest standards.' },
              { icon: '🌱', title: 'Sustainability', desc: 'Eco-friendly construction methods and green building designs across all projects.' },
              { icon: '🤝', title: 'Trust & Legacy', desc: 'More than 40 projects delivered on time with the highest customer satisfaction.' },
              { icon: '💡', title: 'Innovation', desc: 'World-class building techniques powered by state-of-the-art infrastructure.' },
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
            <p style={{ marginLeft: 0 }}>With offices across India, NCC Urban is present in major cities.</p>
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
            <p style={{ marginLeft: 0 }}>Experienced leaders guiding NCC Urban's vision, strategy, and growth.</p>
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
