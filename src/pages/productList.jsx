import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllItems, CATEGORIES } from '../store/itemsSlice'
import { formatCurrency } from '../utils/format.js'

function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value
}

export default function ProductList() {
  const items = useSelector(selectAllItems)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    const min = minPrice === '' ? null : Math.max(0, Number(minPrice))
    const max = maxPrice === '' ? null : Math.max(0, Number(maxPrice))

    return items.filter((it) => {
      if (category && it.category !== category) return false
      if (min != null && Number.isFinite(min) && it.price < min) return false
      if (max != null && Number.isFinite(max) && it.price > max) return false
      if (!kw) return true
      const blob = `${it.title} ${it.description}`.toLowerCase()
      return blob.includes(kw)
    })
  }, [items, q, category, minPrice, maxPrice])

  return (
    <div>
      <h1 className="pageTitle">Product listings</h1>
      <p className="pageSubtitle">
        Search by keyword, filter by price range and category. All prices are in
        Pakistani rupees (PKR).
      </p>

      <div className="card filters">
        <div className="cardInner filterCardInner">
          <h2 className="filterHeading">Filters</h2>
          <div className="filterGrid">
            <div>
              <label className="label" htmlFor="search-q">
                Keywords
              </label>
              <input
                id="search-q"
                className="input"
                placeholder="e.g. calculus, lamp, mouse"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="search-cat">
                Category
              </label>
              <select
                id="search-cat"
                className="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="min-p">
                Min price (PKR)
              </label>
              <input
                id="min-p"
                className="input"
                type="number"
                min={0}
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="max-p">
                Max price (PKR)
              </label>
              <input
                id="max-p"
                className="input"
                type="number"
                min={0}
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 14 }}>
        Showing <strong>{filtered.length}</strong> of {items.length} listings
      </p>

      <div className="productGrid">
        {filtered.map((it) => (
          <article key={it.id} className="card productCard">
            <Link to={`/products/${it.id}`} className="productCardLink">
              <div className="productThumb">
                <img src={it.imageUrl} alt="" loading="lazy" />
              </div>
              <div className="cardInner productCardBody">
                <p className="productMeta">{categoryLabel(it.category)}</p>
                <h2 className="productTitle">{it.title}</h2>
                <p className="productPrice">{formatCurrency(it.price)}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No items match your filters.</p>
      ) : null}
    </div>
  )
}
