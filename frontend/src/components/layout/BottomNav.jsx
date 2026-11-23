import React from 'react';
import { Home, LayoutGrid, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export function BottomNav({ currentPage, onNavigate }) {
  const { cartCount, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAccountClick = () => {
    if (isAuthenticated) {
      onNavigate?.('account', 'profile');
    } else {
      onNavigate?.('login');
    }
  };

  const isHome = !currentPage || currentPage === 'home';
  const isCategories = currentPage === 'categories';
  const isAccount = currentPage === 'account' || currentPage === 'login' || currentPage === 'register';

  return (
    <nav className="fk-bottom-nav" aria-label="Mobile navigation">
      <button
        type="button"
        className={`fk-bottom-nav-item ${isHome ? 'active' : ''}`}
        onClick={() => {
          onNavigate?.('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Home"
      >
        <Home size={22} strokeWidth={isHome ? 2.5 : 2} />
        <span className="fk-bottom-nav-label">Home</span>
      </button>

      <button
        type="button"
        className={`fk-bottom-nav-item ${isCategories ? 'active' : ''}`}
        onClick={() => {
          onNavigate?.('categories');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Categories"
      >
        <LayoutGrid size={22} strokeWidth={isCategories ? 2.5 : 2} />
        <span className="fk-bottom-nav-label">Categories</span>
      </button>

      <button
        type="button"
        className={`fk-bottom-nav-item ${isAccount ? 'active' : ''}`}
        onClick={handleAccountClick}
        aria-label="My Account"
      >
        <User size={22} strokeWidth={isAccount ? 2.5 : 2} />
        <span className="fk-bottom-nav-label">Account</span>
      </button>

      <button
        type="button"
        className="fk-bottom-nav-item"
        onClick={() => setIsCartOpen(true)}
        aria-label="Cart"
      >
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <ShoppingCart size={22} strokeWidth={2} />
          {cartCount > 0 && (
            <span className="fk-bottom-nav-badge">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </div>
        <span className="fk-bottom-nav-label">Cart</span>
      </button>
    </nav>
  );
}

export default BottomNav;
