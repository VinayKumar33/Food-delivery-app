import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Moon, Sun, LogOut, Check, ShoppingBag, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DUMMY_ORDERS = [
  {
    id: '381903',
    restaurantName: 'The Golden Kitchen',
    date: '25 June 2026',
    amount: 320,
    status: 'Delivered',
    items: 'Special Chicken Biryani x1, Butter Naan x1'
  },
  {
    id: '128910',
    restaurantName: 'Green Leaf Pure Veg',
    date: '18 June 2026',
    amount: 270,
    status: 'Delivered',
    items: 'Veg Paneer Butter Masala Combo x1'
  }
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Guest Diner');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [address, setAddress] = useState(user?.address || '123 Heaven Heights, Sky Lane, Sector 7');

  const handleSave = () => {
    updateProfile({
      ...user,
      name,
      phone,
      address
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMockLogin = () => {
    // Populate mock user so the user can easily test
    localStorage.setItem('token', 'mock_jwt_token_for_vinay');
    localStorage.setItem('user', JSON.stringify({
      name: 'Vinay Kumar',
      email: 'vinay@example.com',
      phone: '9175600000',
      address: '123 Heaven Heights, Sky Lane, Sector 7',
      role: 'customer'
    }));
    window.location.reload();
  };

  return (
    <div className="profile-page fade-in" style={{ padding: '16px 20px' }}>
      {/* Header */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px' }}>My Profile</h3>

      {user ? (
        <>
          {/* Profile Card */}
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '20px', 
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '20px'
          }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <span className="input-label">Name</span>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <span className="input-label">Phone</span>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <span className="input-label">Address</span>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" />
                </div>
                <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: '8px', padding: '10px' }}>
                  Save Profile
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary)', 
                    color: 'white',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{user.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Diner Member</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={16} /> <span>{user.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={16} /> <span>{user.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                    <MapPin size={16} style={{ marginTop: '2px' }} /> <span>{user.address}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '16px', padding: '10px', fontSize: '0.85rem' }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Theme Settings & Logout */}
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '20px', 
            padding: '16px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Dark Mode Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {theme === 'dark' ? <Moon size={18} color="var(--primary)" /> : <Sun size={18} color="var(--accent-gold)" />}
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Dark Theme Mode</span>
              </div>
              <button 
                onClick={toggleTheme}
                style={{
                  width: '46px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: theme === 'dark' ? 'var(--primary)' : 'var(--border-color)',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background-color 0.3s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '3px',
                  left: theme === 'dark' ? '25px' : '3px',
                  transition: 'left 0.3s ease'
                }} />
              </button>
            </div>

            {/* Logout button */}
            <div 
              onClick={handleLogout}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                color: 'var(--error)', 
                cursor: 'pointer', 
                padding: '8px 0', 
                fontSize: '0.9rem', 
                fontWeight: '600' 
              }}
            >
              <LogOut size={18} /> <span>Sign Out Account</span>
            </div>
          </div>

          {/* Past Orders list */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="var(--primary)" /> Past Orders History
            </h4>

            {DUMMY_ORDERS.map((ord) => (
              <div 
                key={ord.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '12px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{ord.restaurantName}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600', backgroundColor: 'var(--success-bg)', padding: '2px 8px', borderRadius: '4px' }}>
                    {ord.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{ord.items}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-sub)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <span>{ord.date}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>₹{ord.amount} paid</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <User size={48} color="var(--text-sub)" style={{ marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px' }}>No Diner session detected</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Please log in or register to manage your profile and view past orders.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Log In / Register
            </button>
            <button className="btn btn-secondary" onClick={handleMockLogin}>
              Quick Guest Login (Demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
