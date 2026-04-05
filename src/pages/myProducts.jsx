import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  addItem,
  updateItem,
  deleteItem,
  selectItemsForSeller,
  CATEGORIES,
} from '../store/itemsSlice'
import { selectUserProfile } from '../store/usersSlice'
import { formatCurrency } from '../utils/format.js'

const emptyForm = {
  title: '',
  description: '',
  price: '',
  category: 'BOOKS',
  imageUrl: '',
}

export default function MyProducts() {
  const dispatch = useDispatch()
  const profile = useSelector(selectUserProfile)
  const mine = useSelector((s) => selectItemsForSeller(s, profile?.id))

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  function startEdit(item) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      description: item.description,
      price: String(item.price),
      category: item.category,
      imageUrl: item.imageUrl || '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!profile) return

    const payloadBase = {
      title: form.title,
      description: form.description,
      price: form.price,
      category: form.category,
      imageUrl: form.imageUrl.trim() || undefined,
    }

    if (editingId) {
      dispatch(
        updateItem({
          id: editingId,
          ...payloadBase,
        })
      )
      cancelEdit()
      return
    }

    dispatch(
      addItem({
        sellerId: profile.id,
        ...payloadBase,
      })
    )
    setForm(emptyForm)
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this listing?')) return
    dispatch(deleteItem(id))
    if (editingId === id) cancelEdit()
  }

  return (
    <div>
      <h1 className="pageTitle">My listings</h1>
      <p className="pageSubtitle">
        Edit, add, or remove listings. Prices are in PKR. Optional image URL;
        if you skip it, we pick a stock photo for your category.
      </p>

      <div className="grid2 myProductsLayout">
        <section className="card">
          <div className="cardInner">
            <h2 className="sectionTitle">
              {editingId ? 'Edit listing' : 'New listing'}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="label" htmlFor="ptitle">
                Title
              </label>
              <input
                id="ptitle"
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <label className="label" htmlFor="pdesc">
                Description
              </label>
              <textarea
                id="pdesc"
                className="textarea"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="grid2">
                <div>
                  <label className="label" htmlFor="pprice">
                    Price (PKR)
                  </label>
                  <input
                    id="pprice"
                    className="input"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="pcat">
                    Category
                  </label>
                  <select
                    id="pcat"
                    className="select"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="label" htmlFor="pimg">
                Image URL (optional)
              </label>
              <input
                id="pimg"
                className="input"
                type="url"
                placeholder="https://…"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
              />

              <div className="row" style={{ marginTop: 14 }}>
                <button className="btn btnPrimary" type="submit">
                  {editingId ? 'Save changes' : 'Publish listing'}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    className="btn"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </section>

        <section className="card">
          <div className="cardInner">
            <h2 className="sectionTitle">Your items ({mine.length})</h2>
            {mine.length === 0 ? (
              <p className="muted">You have not posted anything yet.</p>
            ) : (
              <ul className="myList">
                {mine.map((it) => (
                  <li key={it.id} className="myListRow">
                    <div>
                      <Link to={`/products/${it.id}`} className="myListTitle">
                        {it.title}
                      </Link>
                      <p className="muted small">
                        {formatCurrency(it.price)}
                      </p>
                    </div>
                    <div className="row">
                      <button
                        type="button"
                        className="btn btnPrimary"
                        onClick={() => startEdit(it)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btnDanger"
                        onClick={() => handleDelete(it.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
