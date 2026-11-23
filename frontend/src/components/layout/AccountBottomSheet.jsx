import React, { useState, useEffect } from 'react';
import {
  Package,
  Heart,
  User,
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Headphones,
  AlertCircle,
  MessageSquare,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AccountBottomSheet.css';

export function AccountBottomSheet({ isOpen, onClose, onNavigate, onOpenWishlist }) {
  const { user, logout } = useAuth();
  const [activePanel, setActivePanel] = useState(1); // 1 or 2

  // Reset to panel 1 whenever opened
  useEffect(() => {
    if (isOpen) {
      setActivePanel(1);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = user?.name || user?.full_name || user?.email?.split('@')[0] || 'there';

  const handleDestination = (page, subpage) => {
    onClose();
    if (page === 'wishlist') {
      if (onOpenWishlist) onOpenWishlist();
      else onNavigate?.('account', 'wishlist');
    } else {
      onNavigate?.(page, subpage);
    }
  };

  const handleLogout = async () => {
    onClose();
    try {
      await logout();
      onNavigate?.('home');
    } catch (e) {
      // fallback
      onNavigate?.('home');
    }
  };

  return (
    <div className="fk-account-sheet-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div
        className="fk-account-sheet-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Dynamic Greeting */}
        <div className="fk-account-sheet-header">
          <div className="fk-account-sheet-user-info">
            <span className="fk-account-sheet-greeting">Hey, {displayName}</span>
            {user?.email && <span className="fk-account-sheet-email">{user.email}</span>}
          </div>
          <div className="fk-account-sheet-header-actions">
            <button
              type="button"
              className="fk-account-sheet-logout-btn"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
            <button
              type="button"
              className="fk-account-sheet-close-btn"
              onClick={onClose}
              aria-label="Close Account Menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sliding Tiles Carousel / Container */}
        <div className="fk-account-sheet-panels-wrapper">
          <div
            className={`fk-account-sheet-slider ${
              activePanel === 2 ? 'is-panel-2' : 'is-panel-1'
            }`}
          >
            {/* PANEL 1: 3x2 Grid */}
            <div className="fk-account-sheet-panel">
              <div className="fk-account-sheet-grid">
                {/* 1. Orders */}
                <button
                  type="button"
                  className="fk-account-sheet-tile"
                  onClick={() => handleDestination('account', 'orders')}
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: 'rgba(18, 45, 41, 0.08)' }}>
                    <Package size={22} color="var(--fk-header, #122D29)" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Orders</span>
                </button>

                {/* 2. Wishlist */}
                <button
                  type="button"
                  className="fk-account-sheet-tile"
                  onClick={() => handleDestination('wishlist')}
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: '#FDECE9' }}>
                    <Heart size={22} color="#D9381E" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Wishlist</span>
                </button>

                {/* 3. Profile Information */}
                <button
                  type="button"
                  className="fk-account-sheet-tile"
                  onClick={() => handleDestination('account', 'profile')}
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: 'rgba(18, 45, 41, 0.08)' }}>
                    <User size={22} color="var(--fk-header, #122D29)" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Profile</span>
                </button>

                {/* 4. Address Book */}
                <button
                  type="button"
                  className="fk-account-sheet-tile"
                  onClick={() => handleDestination('account', 'address')}
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: 'rgba(18, 45, 41, 0.08)' }}>
                    <MapPin size={22} color="var(--fk-header, #122D29)" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Addresses</span>
                </button>

                {/* 5. Payment Methods */}
                <button
                  type="button"
                  className="fk-account-sheet-tile"
                  onClick={() => handleDestination('account', 'payments')}
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: 'rgba(18, 45, 41, 0.08)' }}>
                    <CreditCard size={22} color="var(--fk-header, #122D29)" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Payments</span>
                </button>

                {/* 6. More -> Panel 2 */}
                <button
                  type="button"
                  className="fk-account-sheet-tile fk-account-sheet-tile-more"
                  onClick={() => setActivePanel(2)}
                  aria-label="View more account options"
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: '#EAE6DC' }}>
                    <ChevronRight size={22} color="var(--fk-header, #122D29)" />
                  </div>
                  <span className="fk-account-sheet-tile-label">More</span>
                </button>
              </div>
            </div>

            {/* PANEL 2: Additional Destinations */}
            <div className="fk-account-sheet-panel">
              <div className="fk-account-sheet-grid">
                {/* 1. Support Tickets */}
                <button
                  type="button"
                  className="fk-account-sheet-tile"
                  onClick={() => handleDestination('account', 'support-tickets')}
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: 'rgba(18, 45, 41, 0.08)' }}>
                    <Headphones size={22} color="var(--fk-header, #122D29)" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Support</span>
                </button>

                {/* 2. My Complaints */}
                <button
                  type="button"
                  className="fk-account-sheet-tile"
                  onClick={() => handleDestination('my-complaints')}
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: '#FFF4E5' }}>
                    <AlertCircle size={22} color="#D97706" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Complaints</span>
                </button>

                {/* 3. My Conversations */}
                <button
                  type="button"
                  className="fk-account-sheet-tile"
                  onClick={() => handleDestination('my-conversations')}
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: 'rgba(18, 45, 41, 0.08)' }}>
                    <MessageSquare size={22} color="var(--fk-header, #122D29)" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Messages</span>
                </button>

                {/* 4. Back Button Tile */}
                <button
                  type="button"
                  className="fk-account-sheet-tile fk-account-sheet-tile-back"
                  onClick={() => setActivePanel(1)}
                  aria-label="Go back to main account options"
                >
                  <div className="fk-account-sheet-tile-icon" style={{ background: '#EAE6DC' }}>
                    <ChevronLeft size={22} color="var(--fk-header, #122D29)" />
                  </div>
                  <span className="fk-account-sheet-tile-label">Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountBottomSheet;
