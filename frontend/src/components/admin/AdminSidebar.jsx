import React from 'react';
import {
  LayoutDashboard, Users, Building2, UserCheck, ShieldAlert,
  FileText, GitCompare, Bot, LogOut, ShoppingCart, ShoppingBag,
  Tags, Truck, Package, CreditCard, RotateCcw, BarChart3,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminSidebar({
  currentView = 'store-dashboard',
  onSelectView,
  isSuperAdmin = false,
  onNavigate,
  collapsed = false,
  setCollapsed,
}) {
  const { logout } = useAuth() || {};

  const handleSignOut = () => {
    logout();
    if (onNavigate) onNavigate('login');
  };

  const NavItem = ({ view, icon: Icon, label, superAdminOnly = false }) => {
    if (superAdminOnly && !isSuperAdmin) return null;
    const isActive = currentView === view;
    return (
      <button
        type="button"
        className={`hd-sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
        onClick={() => onSelectView(view)}
        title={collapsed ? label : undefined}
      >
        <Icon size={18} strokeWidth={1.8} style={{ flexShrink: 0 }} />
        {!collapsed && <span className="hd-sidebar-label">{label}</span>}
        {!collapsed && superAdminOnly && (
          <span className="hd-sidebar-badge" style={{ backgroundColor: '#C2A15A', color: '#183A34', fontWeight: 800 }}>
            SUPER
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className={`hd-sidebar ${collapsed ? 'hd-sidebar-collapsed' : ''}`}>
      {/* Brand & Toggle Header Row */}
      <div className={`ad-sidebar-header-row ${collapsed ? 'collapsed' : ''}`}>
        <div
          className="ad-sidebar-brand"
          onClick={() => onNavigate && onNavigate('home')}
          title="Return to Flatkart Store"
          role="button"
          tabIndex={0}
        >
          <ShoppingCart size={22} strokeWidth={2.4} color="#FFFFFF" style={{ flexShrink: 0 }} />
          {!collapsed && (
            <div className="ad-sidebar-brand-info">
              <span className="ad-sidebar-brand-name">FLATKART</span>
              <span className="ad-sidebar-brand-badge">{isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          className={`ad-sidebar-toggle ${collapsed ? 'collapsed' : 'expanded'}`}
          onClick={() => setCollapsed && setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="hd-sidebar-nav">
        {/* WORKSPACE */}
        <div className="hd-sidebar-group">
          {!collapsed && <div className="hd-sidebar-section-title">WORKSPACE</div>}
          <NavItem view="overview" icon={LayoutDashboard} label="Overview" />
          <NavItem view="users" icon={Users} label="Manage Users" />
          <NavItem view="departments" icon={Building2} label="Manage Departments" />
          <NavItem view="handlers" icon={UserCheck} label="Manage Dept. Handlers" />
          <NavItem view="admins" icon={ShieldAlert} label="Manage Admins" superAdminOnly />
          <NavItem view="pipeline" icon={Bot} label="Chatbot & Pipeline" superAdminOnly />
          <NavItem view="complaints" icon={FileText} label="Complaints" />
          <NavItem view="analytics" icon={GitCompare} label="Redirection Analytics" />
        </div>

        {/* STORE MANAGEMENT */}
        <div className="hd-sidebar-group" style={{ marginTop: 14 }}>
          {!collapsed && <div className="hd-sidebar-section-title">STORE MANAGEMENT</div>}
          <NavItem view="store-dashboard" icon={BarChart3} label="Store Dashboard" />
          <NavItem view="orders" icon={ShoppingBag} label="Orders & Shipments" />
          <NavItem view="inventory" icon={Package} label="Inventory" />
          <NavItem view="payments" icon={CreditCard} label="Payment History" />
          <NavItem view="returns" icon={RotateCcw} label="Returns & Refunds" />
          <NavItem view="products" icon={ShoppingCart} label="Manage Products" />
          <NavItem view="categories" icon={Tags} label="Manage Categories" />
          <NavItem view="shipment-options" icon={Truck} label="Shipment Options" />
        </div>
      </nav>

      <div className="hd-sidebar-footer">
        <button type="button" className="hd-sidebar-logout" onClick={handleSignOut} title="Sign out">
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
