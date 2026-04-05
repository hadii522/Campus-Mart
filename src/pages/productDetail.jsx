import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatCurrency, formatDateTime } from '../utils/format.js'
import { CATEGORIES } from '../store/itemsSlice'
import { selectUserProfile } from '../store/usersSlice'

function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value
}

export default function ProductDetail() {
  const { id } = useParams()
  const item = useSelector((s) => s.item.itemsByID[id])
  const profile = useSelector(selectUserProfile)
  const seller = useSelector((s) =>
    item ? s.user.usersByID[item.sellerId] : null
  )

  if (!item) {
    return (
      <div>
        <h1 className="pageTitle">Listing not found</h1>
        <p className="pageSubtitle">
          This item may have been removed.{' '}
          <Link to="/products">Back to product listings</Link>
        </p>
      </div>
    )
  }

  const isMine = profile?.id === item.sellerId

  return (
    <div className="productDetail">
      <div className="grid2 productDetailGrid">
        <div className="card productDetailMedia">
          <img src={item.imageUrl} alt="" className="productDetailImg" />
        </div>
        <div>
          <p className="productMeta">{categoryLabel(item.category)}</p>
          <h1 className="pageTitle">{item.title}</h1>
          <p className="productPriceLarge">{formatCurrency(item.price)}</p>
          <p className="muted">Listed {formatDateTime(item.createdAt)}</p>
          <p className="productDescription">{item.description}</p>

          <div className="card" style={{ marginTop: 14 }}>
            <div className="cardInner">
              <h2 className="sectionTitle">Seller</h2>
              <p className="muted">
                {seller?.name || 'Unknown student'}
                {seller?.department ? ` · ${seller.department}` : ''}
              </p>
              {isMine ? (
                <p className="success">This is your listing.</p>
              ) : (
                <button type="button" className="btn btnPrimary" disabled>
                  Message seller (coming in Phase 2)
                </button>
              )}
            </div>
          </div>

          <div className="row" style={{ marginTop: 14 }}>
            <Link className="btn" to="/products">
              ← All product listings
            </Link>
            {isMine ? (
              <Link className="btn btnPrimary" to="/my-products">
                Edit in My listings
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
