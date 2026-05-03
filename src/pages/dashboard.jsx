import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserProfile, selectIsAdmin } from '../store/usersSlice'
import { selectItemsForSeller } from '../store/itemsSlice'

export default function Dashboard() {
  const profile = useSelector(selectUserProfile)
  const isAdmin = useSelector(selectIsAdmin)
  const myItems = useSelector((s) =>
    selectItemsForSeller(s, profile?.id)
  )

  return (
    <div>
      <h1 className="pageTitle">Dashboard</h1>
      <p className="pageSubtitle">
        Welcome back{profile?.name ? `, ${profile.name}` : ''}. Listings and
        auth are backed by MongoDB and JWT (Phase 2).
      </p>

      <div className="grid2">
        <section className="card">
          <div className="cardInner">
            <h2 className="sectionTitle">Your snapshot</h2>
            <p className="muted">
              Active listings: <strong>{myItems.length}</strong>
            </p>
            <p className="muted">
              Signed in as <strong>{profile?.email}</strong>
            </p>
            <div className="row" style={{ marginTop: 12 }}>
              <Link className="btn btnPrimary" to="/my-products">
                Manage listings
              </Link>
              <Link className="btn" to="/products">
                Browse marketplace
              </Link>
              {isAdmin ? (
                <Link className="btn btnPrimary" to="/admin">
                  Admin panel
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="card">
          <div className="cardInner">
            <h2 className="sectionTitle">Phase 2 delivered</h2>
            <ul className="plainList">
              <li>Express REST API + MongoDB</li>
              <li>JWT login / register / protected routes</li>
              <li>Product CRUD + image upload (Multer)</li>
              <li>Search & filters via API query params</li>
              <li>Buyer → seller messages (REST)</li>
              <li>Admin panel: users & listings overview</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
