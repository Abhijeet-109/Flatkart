import React from 'react';
import {
  Package,
  Heart,
  User,
  MapPin,
  CreditCard,
  Headphones,
  MessageSquare,
  LogOut,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AccountOverview({ onNavigate, onOpenWishlist, onToggleChatbot }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('home');
    }
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'User';

  const menuItems = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: User,
      action: () => onNavigate?.('account', 'profile'),
    },
    {
      id: 'address',
      label: 'Address Book',
      icon: MapPin,
      action: () => onNavigate?.('account', 'address'),
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      icon: CreditCard,
      action: () => onNavigate?.('account', 'payments'),
    },
    {
      id: 'support-tickets',
      label: 'My Support Tickets',
      icon: Headphones,
      action: () => onNavigate?.('account', 'support-tickets'),
    },
    {
      id: 'complaints',
      label: 'My Complaints',
      icon: Headphones,
      action: () => onNavigate?.('my-complaints'),
    },
    {
      id: 'conversations',
      label: 'My Conversations',
      icon: MessageSquare,
      action: () => onNavigate?.('my-conversations'),
    },
  ];

  return (
    <div className="fk-account-overview-container">
      {/* 1. User Header Banner */}
      <div className="fk-account-user-card">
        <div className="fk-account-user-info">
          <div className="fk-account-user-avatar">
            {displayName[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="fk-account-user-greeting">Hey, {displayName}</h1>
            <p className="fk-account-user-email">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          className="fk-account-help-btn"
          onClick={() => {
            if (onToggleChatbot) onToggleChatbot();
            else onNavigate?.('my-conversations');
          }}
          aria-label="Get Help"
        >
          <HelpCircle size={18} />
          <span>Help</span>
        </button>
      </div>

      {/* 2. Side-by-Side Quick Access Tiles: Orders & Wishlist */}
      <div className="fk-account-quick-tiles">
        <button
          type="button"
          className="fk-account-tile"
          onClick={() => onNavigate?.('account', 'orders')}
          aria-label="View My Orders"
        >
          <div className="fk-account-tile-icon-box">
            <Package size={22} color="var(--fk-header, #122D29)" />
          </div>
          <span className="fk-account-tile-title">Orders</span>
        </button>

        <button
          type="button"
          className="fk-account-tile"
          onClick={() => {
            if (onOpenWishlist) onOpenWishlist();
            else onNavigate?.('account', 'wishlist');
          }}
          aria-label="View Wishlist"
        >
          <div className="fk-account-tile-icon-box">
            <Heart size={22} color="#D9381E" />
          </div>
          <span className="fk-account-tile-title">Wishlist</span>
        </button>
      </div>

      {/* 3. Account Navigation List */}
      <div className="fk-account-menu-card">
        <h2 className="fk-account-menu-heading">Account Settings</h2>
        <div className="fk-account-menu-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="fk-account-menu-row"
                onClick={item.action}
              >
                <div className="fk-account-menu-row-left">
                  <div className="fk-account-menu-icon-wrapper">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <span className="fk-account-menu-row-label">{item.label}</span>
                </div>
                <ChevronRight size={18} className="fk-account-menu-row-chevron" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Logout Action */}
      <div className="fk-account-logout-card">
        <button
          type="button"
          className="fk-account-logout-btn"
          onClick={handleLogout}
          aria-label="Log out of account"
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default AccountOverview;
