import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [s, u, p] = await Promise.all([
          api('/admin/stats'),
          api('/admin/users'),
          api('/admin/products'),
        ])
        if (!cancelled) {
          setStats(s)
          setUsers(u)
          setProducts(p)
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load admin data')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <h1 className="pageTitle">Admin panel</h1>
      <p className="pageSubtitle">
        Monitor users and listings (JWT + admin role). CampusMart — BDS-8B.
      </p>

      {error ? <div className="error">{error}</div> : null}

      {stats ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="cardInner">
            <h2 className="sectionTitle">Overview</h2>
            <p className="muted">
              Registered users: <strong>{stats.users}</strong> · Listings:{' '}
              <strong>{stats.products}</strong>
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid2">
        <section className="card">
          <div className="cardInner">
            <h2 className="sectionTitle">Users</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="cardInner">
            <h2 className="sectionTitle">Listings</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Seller</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/products/${p.id}`}>{p.title}</Link>
                      </td>
                      <td>{p.price}</td>
                      <td>{p.sellerEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <p className="muted" style={{ marginTop: 16 }}>
        <Link to="/dashboard">← Dashboard</Link>
      </p>
    </div>
  )
}
