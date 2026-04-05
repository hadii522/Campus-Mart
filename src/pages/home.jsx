import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <section className="heroPanel">
        <div className="heroGlow" aria-hidden />
        <div className="hero card heroCard">
          <div className="cardInner heroInner">
            <p className="eyebrow">FAST Lahore · @lhr.nu.edu.pk</p>
            <h1 className="heroTitle">Buy and sell on CampusMart</h1>
            <p className="pageSubtitle heroLead">
              Books, notes, gadgets, and hostel essentials — for FAST Lahore
              students only. Prices in PKR; listings use sample data until the
              MERN backend is connected.
            </p>
            <ul className="trustStrip" aria-label="Highlights">
              <li>PKR pricing</li>
              <li>@lhr.nu.edu.pk</li>
              <li>Peer-to-peer</li>
            </ul>
            <div className="row heroActions">
              <Link className="btn btnPrimary btnLg" to="/products">
                Browse marketplace
              </Link>
              <Link className="btn btnGhost btnLg" to="/register">
                Create account
              </Link>
            </div>
            <p className="hint">
              Demo: <code>demo.student@lhr.nu.edu.pk</code> ·{' '}
              <code>demo123</code>
            </p>
          </div>
        </div>
      </section>

      <section className="features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sectionTitle sectionTitleCenter">
          Built for your campus
        </h2>
        <div className="featureGrid">
          <article className="card featureCard">
            <div className="cardInner">
              <span className="featureIcon" aria-hidden>
                ◎
              </span>
              <h3 className="featureTitle">Campus-only</h3>
              <p className="muted">
                Built for the FAST Lahore campus so buyers and sellers share the
                same context and trust.
              </p>
            </div>
          </article>
          <article className="card featureCard">
            <div className="cardInner">
              <span className="featureIcon" aria-hidden>
                ✎
              </span>
              <h3 className="featureTitle">Simple listings</h3>
              <p className="muted">
                Post textbooks, notes, and accessories in minutes. Manage
                everything from your dashboard.
              </p>
            </div>
          </article>
          <article className="card featureCard">
            <div className="cardInner">
              <span className="featureIcon" aria-hidden>
                ⌕
              </span>
              <h3 className="featureTitle">Search & filters</h3>
              <p className="muted">
                Find what you need by category, price in rupees, and keywords —
                try filters on the Product listings page.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
