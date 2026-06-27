import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, ArrowLeft, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [isPartner, setIsPartner] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        // Redirect to dashboard if partner
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'restaurant') {
          navigate('/dashboard');
        } else {
          navigate(redirect ? `/${redirect}` : '/');
        }
      } else {
        setError(result.message);
      }
    } else {
      // Pass role as 'restaurant' if partner signup
      const result = await signup(name, email, password, phone, address, isPartner ? 'restaurant' : 'customer');
      setLoading(false);
      if (result.success) {
        if (isPartner) {
          navigate('/dashboard');
        } else {
          navigate(redirect ? `/${redirect}` : '/');
        }
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="login-page fade-in" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Back button */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={20} /> <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Back</span>
        </button>
        <button 
          onClick={() => setIsPartner(!isPartner)}
          style={{ 
            border: '1px solid var(--border-color)', 
            background: isPartner ? 'var(--primary)' : 'var(--bg-surface)', 
            color: isPartner ? 'white' : 'var(--text-main)', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            fontSize: '0.75rem',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          <Store size={14} /> {isPartner ? 'Partner Mode' : 'Diner Mode'}
        </button>
      </div>

      {/* Brand logo & title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <img src={logo} alt="Logo" style={{ width: '80px', height: '80px', marginBottom: '12px' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
          {isPartner 
            ? (isLogin ? 'Partner Dashboard Login' : 'Become a Restaurant Partner')
            : (isLogin ? 'Welcome back to Heaven' : 'Create your Diner Account')
          }
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {isPartner
            ? (isLogin ? 'Manage your menu and orders' : 'Join our platform to grow your restaurant business')
            : (isLogin ? 'Log in to track orders, manage payments, and re-order' : 'Join Vinay\'s Heaven for delicious offers & faster checkouts')
          }
        </p>
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Name (Signup only) */}
        {!isLogin && (
          <div className="input-group">
            <span className="input-label">{isPartner ? 'Restaurant Owner Name' : 'Full Name'}</span>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
                style={{ paddingLeft: '44px', width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="input-group">
          <span className="input-label">Email Address</span>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              style={{ paddingLeft: '44px', width: '100%' }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <span className="input-label">Password</span>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            <input 
              type="password" 
              placeholder="Min 6 characters" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-field"
              style={{ paddingLeft: '44px', width: '100%' }}
            />
          </div>
        </div>

        {/* Phone (Signup only) */}
        {!isLogin && (
          <div className="input-group">
            <span className="input-label">Phone Number</span>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              <input 
                type="tel" 
                placeholder="Enter 10-digit number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                className="input-field"
                style={{ paddingLeft: '44px', width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Address (Signup only) */}
        {!isLogin && (
          <div className="input-group">
            <span className="input-label">{isPartner ? 'Restaurant Address' : 'Delivery Address'}</span>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} color="var(--text-sub)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              <input 
                type="text" 
                placeholder="Flat / Street / Area" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="input-field"
                style={{ paddingLeft: '44px', width: '100%' }}
              />
            </div>
          </div>
        )}

        {error && <p style={{ color: 'var(--error)', fontSize: '0.8rem', fontWeight: '600' }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px', fontSize: '0.95rem' }}
        >
          {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      {/* Switch mode trigger */}
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
        >
          {isLogin ? 'Register now' : 'Log in here'}
        </button>
      </div>
      
      {/* Test credentials info */}
      {isPartner && isLogin && (
        <div style={{ marginTop: '30px', padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
          <strong>Demo Partner Login:</strong><br/>
          owner@goldenkitchen.com / password123
        </div>
      )}
    </div>
  );
};

export default Login;
