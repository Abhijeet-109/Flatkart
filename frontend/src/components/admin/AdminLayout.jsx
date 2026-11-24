import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import '../handler/HandlerDashboard.css';
import './AdminDashboard.css';

export function AdminLayout({ children, currentView = 'store-dashboard', onSelectView, isSuperAdmin = false, onNavigate, portalTitle }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const title = portalTitle || (isSuperAdmin ? 'Flatkart Super Admin Portal' : 'Flatkart Admin Portal');
  const initials = isSuperAdmin ? 'SA' : user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'A';
  const roleDisplay = isSuperAdmin ? 'Super Admin' : user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')) : 'Admin';

  return (
    <div className={`hd-layout ${collapsed ? 'hd-collapsed' : ''} ad-layout`}>
      <AdminSidebar
        currentView={currentView}
        onSelectView={onSelectView}
        isSuperAdmin={isSuperAdmin}
        onNavigate={onNavigate}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="hd-main-wrapper ad-main-wrapper">
        <header className="hd-topbar ad-topbar">
          <div className="hd-topbar-left">
            <h1 className="hd-topbar-title ad-topbar-portal-title">{title}</h1>
          </div>
          <div className="hd-topbar-right ad-topbar-right">
            <div className="hd-topbar-dept-info ad-topbar-profile-info">
              <span className="hd-topbar-dept-name ad-topbar-profile-name">{user?.name || (isSuperAdmin ? 'Super Admin' : 'Admin User')}</span>
              <span className="hd-topbar-dept-role ad-topbar-profile-role">{roleDisplay}</span>
            </div>
            <div className="hd-topbar-avatar ad-topbar-avatar">{initials}</div>
          </div>
        </header>
        <main className="hd-content ad-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
