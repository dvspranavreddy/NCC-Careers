import { Link } from 'react-router-dom'


const groupInShort = [
  {
    title: 'Our Values',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    to: '/about',
  },
  {
    title: 'What We Do',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    to: '/about',
  },
  {
    title: 'Investor Relations',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    href: 'https://www.nccgroupplc.com/investor-relations/',
  },
  {
    title: 'Careers',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
    to: '/careers',
  },
  {
    title: 'Newsroom',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
    href: 'https://www.nccgroup.com/newsroom/',
  },
  {
    title: 'Contact Us',
    img: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&q=80',
    href: 'https://www.nccgroupplc.com/contact-us/',
  },
]

export default function HomePage() {
  return (
    <div className="homepage">

      {/* Hero */}
      <section className="hp-hero">
        <div className="hp-hero-content">
          <h1>A Group with two leading,<br />global <span style={{ color: 'var(--accent)' }}>businesses:</span></h1>
          <div className="hp-hero-pills">
            <span className="hp-pill">People-powered, tech-enabled cyber security</span>
            <span className="hp-pill hp-pill-outline">Market-leading software escrow</span>
          </div>
        </div>
      </section>

      {/* Global Team Section */}
      <section className="hp-section">
        <div className="hp-container">
          <div className="hp-accent-heading">
            <h2>A global team helping to create a more secure digital future</h2>
          </div>
          <div className="hp-text-block">
            <p>
              NCC Group has two distinct businesses: a people-powered, tech-enabled global{' '}
              <a href="https://www.nccgroup.com/uk/cyber-security/" target="_blank" rel="noopener noreferrer">
                cyber security
              </a>{' '}
              company and a market-leading software escrow business.
            </p>
            <p>
              NCC Group's global people-powered, tech-enabled cyber security team works with the world's leading companies
              to protect against cyber threats and build cyber resilience, is a trusted advisor to Governments on their
              cyber strategies, and educates policymakers and regulators on emerging technologies and inform standards.
            </p>
            <p>
              The Group's{' '}
              <a href="https://www.nccgroup.com/uk/escrow/" target="_blank" rel="noopener noreferrer">
                software escrow business
              </a>{' '}
              is a global market leader, protecting and verifying the code of leading private and public sector entities
              around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Annual Report Banner */}
      <section className="hp-annual-report">
        <div className="hp-container">
          <div className="hp-ar-card">
            <div className="hp-ar-book">
              <div className="hp-ar-book-spine" />
              <div className="hp-ar-book-cover">
                <p style={{ fontSize: '0.5rem', fontWeight: 700, color: 'white', lineHeight: 1.4 }}>
                  NCC Group<br />Annual<br />Report<br />2025
                </p>
              </div>
            </div>
            <div className="hp-ar-text">
              <h3>Annual Report</h3>
              <p>Read online or download our annual report and accounts for the period ended 10 September 2025.</p>
              <a
                href="https://www.nccgroupplc.com/investor-relations/annual-report/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-sm"
              >
                Read online
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="hp-section">
        <div className="hp-container">
          <div className="hp-accent-heading">
            <h2>Sustainability</h2>
          </div>
          <p className="hp-sub-text">
            Environmental, social and governance (ESG) considerations are integrated into the policies and principles
            that govern our group and reflect our commitment to sustainable growth.
          </p>
          <a
            href="https://www.nccgroupplc.com/sustainability/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent"
            style={{ marginTop: '20px', display: 'inline-flex' }}
          >
            Read More
          </a>
        </div>
      </section>

      {/* NCC Group in Short */}
      <section className="hp-section hp-section-alt">
        <div className="hp-container">
          <div className="hp-accent-heading">
            <h2>NCC Group in Short</h2>
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
