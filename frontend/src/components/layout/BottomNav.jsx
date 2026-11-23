import React from 'react';
import { Home, LayoutGrid, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export function BottomNav({ currentPage, onNavigate }) {
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAccountClick = () => {
    if (isAuthenticated) {
      onNavigate?.('account', 'overview');
    } else {
      onNavigate?.('login');
    }
  };

  const isCart = Boolean(isCartOpen || currentPage === 'cart');
  const isHome = (!currentPage || currentPage === 'home') && !isCart;
  const isCategories = currentPage === 'categories' && !isCart;
  const isAccount = (currentPage === 'account' || currentPage === 'login' || currentPage === 'register') && !isCart;

  return (
    <nav className="fk-bottom-nav" aria-label="Mobile navigation">
      <button
        type="button"
        className={`fk-bottom-nav-item ${isHome ? 'is-active' : ''}`}
        onClick={() => {
          if (isCartOpen) setIsCartOpen(false);
          onNavigate?.('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Home"
      >
        <div className="fk-bottom-nav-icon-wrap">
          <Home size={22} strokeWidth={isHome ? 2.5 : 2} />
        </div>
        <span className="fk-bottom-nav-label">Home</span>
      </button>

      <button
        type="button"
        className={`fk-bottom-nav-item ${isCategories ? 'is-active' : ''}`}
        onClick={() => {
          if (isCartOpen) setIsCartOpen(false);
          onNavigate?.('categories');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Categories"
      >
        <div className="fk-bottom-nav-icon-wrap">
          <LayoutGrid size={22} strokeWidth={isCategories ? 2.5 : 2} />
        </div>
        <span className="fk-bottom-nav-label">Categories</span>
      </button>

      <button
        type="button"
        className={`fk-bottom-nav-item ${isAccount ? 'is-active' : ''}`}
        onClick={() => {
          if (isCartOpen) setIsCartOpen(false);
          handleAccountClick();
        }}
        aria-label="My Account"
      >
        <div className="fk-bottom-nav-icon-wrap">
          <User size={22} strokeWidth={isAccount ? 2.5 : 2} />
        </div>
        <span className="fk-bottom-nav-label">Account</span>
      </button>

      <button
        type="button"
        className={`fk-bottom-nav-item ${isCart ? 'is-active' : ''}`}
        onClick={() => setIsCartOpen(!isCartOpen)}
        aria-label="Cart"
      >
        <div className="fk-bottom-nav-icon-wrap">
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <ShoppingCart size={22} strokeWidth={isCart ? 2.5 : 2} />
            {cartCount > 0 && (
              <span className="fk-bottom-nav-badge">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </div>
        </div>
        <span className="fk-bottom-nav-label">Cart</span>
      </button>
    </nav>
  );
}

export default BottomNav;
