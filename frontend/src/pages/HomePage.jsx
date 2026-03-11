import { Link } from 'react-router-dom'


const groupInShort = [
  {
    title: 'About Us',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    to: '/about',
  },
  {
    title: 'Our Projects',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    href: 'https://www.nccurban.com/ongoing-projects-in-hyderabad.html',
  },
  {
    title: 'Testimonials',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    href: 'https://www.nccurban.com/testimonial.html',
  },
  {
    title: 'Careers',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
    to: '/careers',
  },
  {
    title: 'Interiors',
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    href: 'https://www.nccurban.com/interior.html',
  },
  {
    title: 'Contact Us',
    img: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&q=80',
    href: 'https://www.nccurban.com/contactus.php',
  },
]

export default function HomePage() {
  return (
    <div className="homepage">

      {/* Hero */}
      <section className="hp-hero">
        <div className="hp-hero-content">
          <h1>Trusted Brand With<br />4 Decades Of <span style={{ color: 'var(--accent)' }}>Legacy</span></h1>
          <div className="hp-hero-pills">
            <span className="hp-pill">Premium Residential &amp; Commercial Spaces</span>
            <span className="hp-pill hp-pill-outline">ISO 9001-14001-18001 Certified Company</span>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="hp-section">
        <div className="hp-container">
          <div className="hp-accent-heading">
            <h2>Welcome to NCC Urban</h2>
          </div>
          <div className="hp-text-block">
            <p>
              NCC Urban Infrastructure Ltd. is a Subsidiary of{' '}
              <a href="https://ncclimited.com/" target="_blank" rel="noopener noreferrer">
                NCC Limited
              </a>{' '}
              and comes equipped with world-class building techniques and state-of-the-art
              building infrastructure that is expertly commandeered by top-notch professionals.
            </p>
            <p>
              NCC Urban's quality operations span across Residential and Commercial complexes,
              Villas, Row-Houses, Residential Layouts, Townships, SEZ's and Serviced Apartment
              complexes. With more than 40 completed projects and the highest customer
              satisfaction, NCC Urban has successfully delivered 11.7 million sq. ft of built-up
              area, and is all set to deliver 6.6 million sq. ft more.
            </p>
            <p>
              The company has an impressive pan-India presence across Bengaluru, Hyderabad,
              Chennai, Kochi, Guntur and Ranchi. NCC Urban has inherited its experience and
              expertise from NCC Limited, a leading infrastructure company in India with more
              than 4 decades of expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Key Figures Banner */}
      <section className="hp-annual-report">
        <div className="hp-container">
          <div className="hp-ar-card">
            <div className="hp-ar-book">
              <div className="hp-ar-book-spine" />
              <div className="hp-ar-book-cover">
                <p style={{ fontSize: '0.5rem', fontWeight: 700, color: 'white', lineHeight: 1.4 }}>
                  NCC Urban<br />Projects<br />Portfolio<br />2025
                </p>
              </div>
            </div>
            <div className="hp-ar-text">
              <h3>Our Track Record</h3>
              <p>46 years in the industry&nbsp;&middot;&nbsp;44+ successful projects&nbsp;&middot;&nbsp;10,000+ happy families across India.</p>
              <a
                href="https://www.nccurban.com/ongoing-projects-in-hyderabad.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-sm"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Sustainability */}
      <section className="hp-section">
        <div className="hp-container">
          <div className="hp-accent-heading">
            <h2>Quality &amp; Sustainability</h2>
          </div>
          <p className="hp-sub-text">
            NCC Urban is committed to the highest standards of quality, health, safety and
            environmental sustainability. As an ISO 9001-14001-18001 certified company, we
            integrate responsible practices into every project — from eco-friendly construction
            methods to green building designs.
          </p>
          <a
            href="https://www.nccurban.com/aboutus.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent"
            style={{ marginTop: '20px', display: 'inline-flex' }}
          >
            Read More
          </a>
        </div>
      </section>

      {/* NCC Urban in Short */}
      <section className="hp-section hp-section-alt">
        <div className="hp-container">
          <div className="hp-accent-heading">
            <h2>NCC Urban at a Glance</h2>
          </div>
          <div className="hp-cards-grid">
            {groupInShort.map((item) => {
              const inner = (
                <>
                  <img src={item.img} alt={item.title} className="hp-card-img" />
                  <div className="hp-card-overlay">
                    <span>{item.title}</span>
                  </div>
                </>
              )
              return item.to ? (
                <Link to={item.to} key={item.title} className="hp-card">
                  {inner}
                </Link>
              ) : (
                <a
                  href={item.href}
                  key={item.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hp-card"
                >
                  {inner}
                </a>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
