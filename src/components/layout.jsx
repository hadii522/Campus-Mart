import { NavLink, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../store/usersSlice'

function navItemClass({ isActive }) {
  return `navItem${isActive ? ' navItemActive' : ''}`
}

function navQuietClass({ isActive }) {
  return `navItem navItemQuiet${isActive ? ' navItemActive' : ''}`
}

function navCtaClass({ isActive }) {
  return `btn btnPrimary btnNav${isActive ? ' btnNavActive' : ''}`
}

function navUserClass({ isActive }) {
  return `navUser${isActive ? ' navUserActive' : ''}`
}

function initialsFromName(name) {
  const s = String(name || '').trim()
  if (!s) return '?'
  const parts = s.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function firstNameFromName(name) {
  const s = String(name || '').trim()
  if (!s) return 'Account'
  return s.split(/\s+/)[0]
}

export default function Layout({ children }) {
  const profile = useSelector(selectUserProfile)

  return (
    <div className="appShell">
      <header className="topbar topbarSticky" role="banner">
        <div className="container topbarInner">
          <Link to="/" className="brand">
            <span className="brandMark" aria-hidden>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 2L3 7v10l9 5 9-5V7l-9-5z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22V12M12 12L3 7M12 12l9-5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="brandStack">
              <span className="brandText">CampusMart</span>
              <span className="brandTag">FAST Lahore</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Main">
            <div className="navLinks">
              <NavLink to="/" end className={navItemClass}>
                Home
              </NavLink>
              {profile ? (
                <NavLink to="/dashboard" className={navItemClass}>
                  Dashboard
                </NavLink>
              ) : null}
              <NavLink to="/products" className={navItemClass}>
                Listings
              </NavLink>
              {profile ? (
                <NavLink to="/my-products" className={navItemClass}>
                  My listings
                </NavLink>
              ) : null}
            </div>

            <div className="navActions">
              {profile ? (
                <NavLink
                  to="/profile"
                  className={navUserClass}
                  title="Your profile"
                >
                  <span className="navUserAvatar" aria-hidden>
                    {initialsFromName(profile.name)}
                  </span>
                  <span className="navUserMeta">
                    <span className="navUserHi">Signed in</span>
                    <span className="navUserName">
                      {firstNameFromName(profile.name)}
                    </span>
                  </span>
                </NavLink>
              ) : (
                <>
                  <NavLink to="/login" className={navQuietClass}>
                    Log in
                  </NavLink>
                  <NavLink to="/register" className={navCtaClass}>
                    Join
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="main" id="main-content">
        <div className="container mainInner">{children}</div>
      </main>
      <footer className="footer">
        <div className="container footerInner">
          <div className="footerBrand">
            <span className="footerLogo">CampusMart</span>
            <p className="footerTagline">
              A trusted marketplace for FAST Lahore students.
            </p>
          </div>
          <p className="footerMeta">
            BDS-8B · Web Engineering (Phase 1). Emaan Munib (22L-7509) · Aizaz
            Haider Goraya (22L-8371).
          </p>
        </div>
      </footer>
    </div>
  )
}
