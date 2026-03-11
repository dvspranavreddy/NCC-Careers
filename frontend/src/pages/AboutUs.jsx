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
    initials: 'AN',
  },
  {
    name: 'Mr. Rajender Mohan Malla',
    title: 'Independent Director',
    bio: 'Mr. R M Malla brings over four decades of experience in banking and finance. His leadership roles include Chairman and MD of IDBI Bank and SIDBI, CEO of IFCI, and MD & CEO of PTC India Financial Services Ltd. He currently serves on the board of several leading companies.He holds an MBA from the Faculty of Management Studies, University of Delhi, a PGDBM from MDI Gurgaon, and is a Certified Associate of the Indian Institute of Bankers.',
    initials: 'RK',
  },
  {
    name: 'Mrs. Uma Shankar',
    title: 'Independent Director',
    bio: 'Mrs. Uma Shankar has nearly four decades of experience in the financial sector, particularly in Banking Supervision, Currency Management, Urban Banks Regulation and Administration. She held various senior roles at RBI, including its Executive Director and was nominated to the Boards of reputed institutions and banks.She holds a Post Graduate degree in English, is a Certified Associate of the Indian Institute of Bankers and has completed Executive Education at Columbia Business School, New York.',
    initials: 'SS',
  },
  {
    name: 'Mr. Ramesh Kailasam',
    title: 'Independent Director',
    bio: 'Mr. Ramesh Kailasam is a Cost Accountant with nearly three decades of multi-sectoral experience. His core competencies include governance reforms, public policy, leadership, strategy and government engagement. He has authored numerous reports and publications which have been used by governments, industry bodies, think tanks and international agencies.He is the CEO of IndiaTech.org, an industry association representing India’s consumer internet start-ups, unicorns and investors.',
    initials: 'VM',
  },
  {
    name: 'Mr. Sumit Banerjee',
    title: 'Independent Director',
    bio: 'Mr. Sumit Banerjee has over four decades of experience in management and leadership roles. He served at Management levels with renowned corporates namely ACC, Reliance, Hindalco and L&T. He is a recipient of the Corporate Citizen award at the CNBC-TV18 Indian Business Leader Awards - 2009.He holds a bachelor’s degree in technology from IIT, Kharagpur. He has also completed the ‘Leading Change and Organizational Renewal’ programme from Harvard Business School and management education programme from IIM, Ahmedabad.',
    initials: 'AR',
  },
  {
    name: 'Mr. Utpal Sheth',
    title: 'Director',
    bio: 'Mr. Utpal Sheth brings over three decades of experience in financial investments and capital markets including fundraising, mergers & acquisitions, and corporate advisory. Formerly, the CEO and Senior Partner at Rare Enterprises - founded by late Sri Rakesh Jhunjhunwala.He is a qualified Cost Accountant, a CFA and holds a Diploma in Systems Management from NIIT. He is the Founder and Mentor of the TRUST Group, an Institutionalized Multi-Line and Multi-Asset Financial Services Platform.',
    initials: 'SP',
  },
  {
    name: 'Mr. A A V Ranga Raju',
    title: 'Managing Director',
    bio: 'Mr. Ranga Raju has four decades of experience in Construction, Infrastructure Development and allied fields. Mr. Ranga Raju, joined the family business at a very early age, soon after completing his education. He has been the MD of the company for more than three decades and has been instrumental in propelling the company ahead.',
    initials: 'SP',
  },
  {
    name: 'Mr. A G K Raju',
    title: 'Executive Director',
    bio: 'Mr. A G K Raju has experience of four decades in Construction, Finance, Materials Management, Administration, HR, Corporate Communications and allied areas. It is his leadership that has helped steer the company’s operations to make it more efficient and smart.Mr. A G K Raju holds an MBA post-graduate degree from Pune University.',
    initials: 'SP',
  },
  {
    name: 'Mr. A S N Raju',
    title: 'Wholetime Director',
    bio: 'Mr. A S N Raju’s valuable experience of four decades in the construction industry is a formidable asset to the company. His execution capabilities of projects are commendable. His current responsibilities include overseeing the Buildings Division and CSR activities at NCC.',
    initials: 'SP',
  },
  {
    name: 'Mr. J V Ranga Raju',
    title: 'Wholetime Director',
    bio: 'Mr. J V Ranga Raju has been associated with the Construction Industry for four decades. His rich experience has been instrumental in turning the company into one of the largest construction companies in India in the vast and fast-changing scenario. He has business interests in the Hospitality and Education fields.',
    initials: 'SP',
  },
  {
    name: 'Mr. A V N Raju',
    title: 'Wholetime Director',
    bio: 'Mr. A V N Raju has gained a wealth of knowledge through close to four decades of experience in the construction industry. With his commitment and diligence, he leads the operations of the Electrical and Irrigation Divisions of the company.',
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
    city: 'Ahmedabad',
    label: 'Regional Office',
    address: '# 211 – 212, Sarthik – II, Opp. Rajpath Club, S G Highway, Ahmedabad – 380054',
    phone: '+91 79 2687 1478 / 79',
    email: 'ro.ahmd@nccltd.in',
  },
  {
    city: 'Amaravati',
    label: 'Regional Office',
    address: 'Seed Capital Access Road Lingayapalem (Vill), Tullur (Mandal), Guntur Dist. - 522 237',
    phone: '+91 96770 59977',
    email: 'ro.amaravathi@nccltd.in',
  },
  {
    city: 'Bangalore',
    label: 'Regional Office',
    address: '# 301 Batavia Chambers, 8 Kumara Krupa Road, Kumara Park, East Bengaluru - 560 001',
    phone: '+91 80 2225 8991 / 3309',
    email: 'ro.blr@nccltd.in',
  },
  {
    city: 'Chennai',
    label: 'Regional Office',
    address: '#2A, 2nd Floor, Jains Archway, 91/13, ORMES Road, Kilpauk, Chennai – 600010',
    phone: '+91 96770 59977',
    email: 'ro.chennai@nccltd.in',
  },
  {
    city: 'Delhi',
    label: 'Regional Office',
    address: 'PHD House, 4/2 Siri Institutional Area, August Kranti Marg,New Delhi - 110 016',
    phone: '+91 11 4032 5300',
    email: 'bldgs.rodelhi@nccltd.in',
  },
  {
    city: 'Kolkata',
    label: 'Regional Office',
    address: 'ECO Space Business Park, Block No. 4A, 5th Floor, New Town Action Area - II, Kolkata - 700 156',
    phone: '+91 33 4029 8888',
    email: 'ro.kolkatta@nccltd.in',
  },
  {
    city: 'Lucknow',
    label: 'Regional Office',
    address: 'IBB-3, Plot No. : CP-24, Sector F, Sushant Golf City, Ansal API, Near Atal Chowk, Lucknow - 226030',
    phone: '+91 88085 28888',
    email: 'ro.lucknow@nccltd.in',
  },
  {
    city: 'Mumbai',
    label: 'Regional Office',
    address: 'A-914, Kanakia Wall Street, Andheri Kurla Road, Chakala Andheri East, Mumbai - 400 093',
    phone: '+91 22 6298 8000',
    email: 'ro.mumbai@nccltd.in',
  },
  {
    city: 'Patna',
    label: 'Regional Office',
    address: 'A/3, Road No. A, 2nd Floor, Vivekananda Park, Boring Patliputra Road,Patna - 800 013',
    phone: '+91 61 2257 1196',
    email: 'ro.patna@nccltd.in',
  },
  {
    city: 'Pune',
    label: 'Regional Office',
    address: 'Purushottarn Plaza, 3rd Floor, Office No. 3, Baner-Balewadi Road,Pune - 411 045',
    phone: '+91 20 4650 4200',
    email: 'ro.pune@nccltd.in',
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
            Building India's future for over 46 years. From highways and airports to smart cities
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
