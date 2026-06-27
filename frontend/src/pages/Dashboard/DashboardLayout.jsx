import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Utensils, Store, Star, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import logo from '../../../assets/logo.svg';

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/dashboard/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Menu Management', path: '/dashboard/menu', icon: <Utensils size={20} /> },
    { name: 'Restaurant Profile', path: '/dashboard/profile', icon: <Store size={20} /> },
    { name: 'Customer Reviews', path: '/dashboard/reviews', icon: <Star size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }} 
        />
      )}

      {/* Sidebar */}
      <div 
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          boxShadow: 'var(--shadow-md)',
          ...window.innerWidth >= 768 && { position: 'static', transform: 'none' } // Simple responsive override
        }}
        className="dashboard-sidebar"
      >
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Heaven Partner</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dashboard</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setIsSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                fontWeight: isActive ? '700' : '500',
                transition: 'all 0.2s',
                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
              })}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{user?.name || 'Partner'}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--error)', fontWeight: '600', cursor: 'pointer' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Topbar for mobile toggle */}
        <div className="mobile-topbar" style={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '8px' }}
          >
            <Menu size={24} />
          </button>
          <h3 style={{ marginLeft: '12px', fontSize: '1.2rem', fontWeight: '700' }}>Partner Dashboard</h3>
        </div>

        {/* Content scrolling area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: 'var(--bg-main)' }}>
          <Outlet />
        </div>
      </div>

      {/* Injecting some basic responsive styles just for the dashboard layout if needed */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-topbar { display: none !important; }
        }
        @media (max-width: 767px) {
          .dashboard-sidebar {
            /* Handled via inline styles above */
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
