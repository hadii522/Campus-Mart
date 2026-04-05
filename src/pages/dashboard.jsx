import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../store/usersSlice'
import { selectItemsForSeller } from '../store/itemsSlice'

export default function Dashboard() {
  const profile = useSelector(selectUserProfile)
  const myItems = useSelector((s) =>
    selectItemsForSeller(s, profile?.id)
  )

  return (
    <div>
      <h1 className="pageTitle">Dashboard</h1>
      <p className="pageSubtitle">
        Welcome back{profile?.name ? `, ${profile.name}` : ''}. Manage your
        listings and browse the campus marketplace.
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
            </div>
          </div>
        </section>

        <section className="card">
          <div className="cardInner">
            <h2 className="sectionTitle">Coming in later phases</h2>
            <ul className="plainList">
              <li>JWT authentication with Express API</li>
              <li>MongoDB-backed listings and images</li>
              <li>Messaging between buyers and sellers</li>
              <li>Ratings, reviews, and admin moderation</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
