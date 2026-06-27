import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Search, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();

  const currentPath = location.pathname;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 72,
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 20,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      
      {/* Explore / Home Tab */}
      <div 
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          color: currentPath === '/' ? 'var(--primary)' : 'var(--text-sub)',
          transition: 'color var(--transition-fast)'
        }}
      >
        <Compass size={22} color={currentPath === '/' ? 'var(--primary)' : 'var(--text-sub)'} />
        <span style={{ fontSize: '0.75rem', fontWeight: currentPath === '/' ? '700' : '500' }}>Home</span>
      </div>

      {/* Search Tab */}
      <div 
        onClick={() => navigate('/search')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          color: currentPath === '/search' ? 'var(--primary)' : 'var(--text-sub)',
          transition: 'color var(--transition-fast)'
        }}
      >
        <Search size={22} color={currentPath === '/search' ? 'var(--primary)' : 'var(--text-sub)'} />
        <span style={{ fontSize: '0.75rem', fontWeight: currentPath === '/search' ? '700' : '500' }}>Search</span>
      </div>

      {/* Orders Tab */}
      <div 
        onClick={() => navigate('/orders')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          color: currentPath === '/orders' ? 'var(--primary)' : 'var(--text-sub)',
          transition: 'color var(--transition-fast)'
        }}
      >
        <ShoppingBag size={22} color={currentPath === '/orders' ? 'var(--primary)' : 'var(--text-sub)'} />
        <span style={{ fontSize: '0.75rem', fontWeight: currentPath === '/orders' ? '700' : '500' }}>Orders</span>
      </div>

      {/* Cart Tab with Badge */}
      <div 
        onClick={() => navigate('/cart')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          color: currentPath === '/cart' ? 'var(--primary)' : 'var(--text-sub)',
          position: 'relative',
          transition: 'color var(--transition-fast)'
        }}
      >
        <ShoppingCart size={22} color={currentPath === '/cart' ? 'var(--primary)' : 'var(--text-sub)'} />
        <span style={{ fontSize: '0.75rem', fontWeight: currentPath === '/cart' ? '700' : '500' }}>Cart</span>
        
        {getCartCount() > 0 && (
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-10px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '0.65rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-card)'
          }}>
            {getCartCount()}
          </div>
        )}
      </div>

      {/* Profile Tab */}
      <div 
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          color: currentPath === '/profile' ? 'var(--primary)' : 'var(--text-sub)',
          transition: 'color var(--transition-fast)'
        }}
      >
        <User size={22} color={currentPath === '/profile' ? 'var(--primary)' : 'var(--text-sub)'} />
        <span style={{ fontSize: '0.75rem', fontWeight: currentPath === '/profile' ? '700' : '500' }}>Profile</span>
      </div>

    </div>
  );
};

export default BottomNavigation;
