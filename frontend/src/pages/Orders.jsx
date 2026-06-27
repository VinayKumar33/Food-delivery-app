import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';

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

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="orders-page fade-in" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>My Orders</h3>
      </div>

      {!user ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <ShoppingBag size={48} color="var(--text-sub)" style={{ marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px' }}>No session detected</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Please log in to view your orders and track live deliveries.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/login?redirect=orders')}>
            Log In / Register
          </button>
        </div>
      ) : (
        <div>
          {/* Active / Current order simulation link if they just checked out */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px dashed var(--primary)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onClick={() => navigate('/track/729104')}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Active Order Status
              </span>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '2px' }}>Track order #729104</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Simulated delivery in progress</p>
            </div>
            <ArrowRight size={18} color="var(--primary)" />
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>
            Past Orders History
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
      )}
    </div>
  );
};

export default Orders;
