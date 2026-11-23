import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const fallbackImg = '/assets/cat_men_hi.jpg';

function WishlistItemRow({ item, onNavigate, onToggleWishlist, onCloseDrawer }) {
  const initialImg = item.images?.[0]?.url || item.image || fallbackImg;
  const [imgSrc, setImgSrc] = useState(initialImg);
  const targetSlug = item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : item.id);

  const handleOpenProduct = () => {
    onCloseDrawer();
    if (targetSlug && onNavigate) {
      onNavigate('product', targetSlug);
    }
  };

  return (
    <div className="fk-drawer-item">
      <img
        src={imgSrc}
        alt={item.name}
        className="fk-drawer-item-img"
        style={{ cursor: 'pointer' }}
        onClick={handleOpenProduct}
        onError={() => {
          if (imgSrc !== fallbackImg) setImgSrc(fallbackImg);
        }}
      />
      <div style={{ flex: 1, cursor: 'pointer' }} onClick={handleOpenProduct} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleOpenProduct(); }}>
        <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--fk-text-primary)' }}>
          {item.brand || 'Flatkart'}
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--fk-text-muted)' }}>
          {item.name}
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--fk-price-coral)', marginTop: '2px' }}>
          {item.variants?.[0]?.price != null ? `₹${Number(item.variants[0].price).toLocaleString('en-IN')}` : item.price ?? 'Price unavailable'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          className="fk-add-cart-btn"
          style={{ fontSize: '11px', padding: '6px 10px', cursor: 'pointer' }}
          type="button"
          onClick={handleOpenProduct}
          title="View product details and options"
        >
          View product
        </button>
        <button
          style={{ color: '#9E9E9E', cursor: 'pointer', background: 'none', border: 'none', padding: '6px' }}
          onClick={() => onToggleWishlist(item)}
          aria-label={`Remove ${item.name} from wishlist`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function WishlistDrawer({ onNavigate }) {
  const { wishlistItems, wishlistError, toggleWishlist, isWishlistOpen, setIsWishlistOpen } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fk-drawer-overlay" onClick={() => setIsWishlistOpen(false)}>
      <div className="fk-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="fk-drawer-header">
          <h3 style={{ fontSize: '17px', fontWeight: '700' }}>
            My Wishlist ({wishlistItems.length})
          </h3>
          <button
            style={{ color: '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close Wishlist"
          >
            <X size={20} />
          </button>
        </div>

        <div className="fk-drawer-content">
          {wishlistError && <p className="fk-cart-error" role="alert">{wishlistError}</p>}
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fk-text-muted)' }}>
              No items in your wishlist yet.
            </div>
          ) : (
            wishlistItems.map((item) => (
              <WishlistItemRow
                key={item.id}
                item={item}
                onNavigate={onNavigate}
                onToggleWishlist={toggleWishlist}
                onCloseDrawer={() => setIsWishlistOpen(false)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
