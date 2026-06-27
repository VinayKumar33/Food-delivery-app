import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2, MapPin, ChevronRight, Plus, Minus, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartRestaurant, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const itemTotal = getCartTotal();
  const gst = Math.round(itemTotal * 0.05); // 5% GST
  const deliveryCharge = itemTotal > 0 ? 30 : 0;
  const originalBill = itemTotal + gst + deliveryCharge;
  const totalBill = originalBill - appliedDiscount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'HEAVEN50') {
      const discount = Math.round(itemTotal * 0.5);
      setAppliedDiscount(discount);
      setCouponSuccess(`HEAVEN50 applied! You saved ₹${discount}`);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try HEAVEN50');
      setCouponSuccess('');
      setAppliedDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout', { state: { appliedDiscount } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--bg-surface)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '20px',
          color: 'var(--text-sub)'
        }}>
          <ShoppingBag size={48} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Your cart is empty</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '280px' }}>
          Good food is always cooking! Go ahead, order some yummy items from the menu.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page fade-in" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(`/restaurant/${cartRestaurant?.id || 1}`)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>My Cart</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Ordering from {cartRestaurant?.name}
          </span>
        </div>
      </div>

      {/* Cart Items List */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Items Ordered</span>
          <button 
            onClick={clearCart}
            style={{ 
              border: 'none', 
              background: 'none', 
              color: 'var(--primary)', 
              fontSize: '0.8rem', 
              fontWeight: '600', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={12} /> Clear all
          </button>
        </div>

        {cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`diet-badge ${item.isVeg ? '' : 'non-veg'}`}></span>
              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</h5>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{item.price}</span>
              </div>
            </div>

            {/* Qty Adjustment Widget */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                backgroundColor: 'var(--bg-surface)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '74px',
                height: '28px',
                overflow: 'hidden'
              }}>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ border: 'none', background: 'none', width: '24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)' }}
                >
                  <Minus size={12} />
                </button>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ border: 'none', background: 'none', width: '24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)' }}
                >
                  <Plus size={12} />
                </button>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', minWidth: '40px', textAlign: 'right' }}>
                ₹{item.price * item.quantity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Cooking Instructions checkbox */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <FileText size={20} color="var(--primary)" />
        <input 
          type="text" 
          placeholder="Add cooking instructions (e.g., make it spicy)..." 
          style={{ 
            border: 'none', 
            outline: 'none', 
            background: 'none', 
            width: '100%', 
            fontFamily: 'var(--font-family)', 
            color: 'var(--text-main)',
            fontSize: '0.85rem'
          }}
        />
      </div>

      {/* Coupon section */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '10px' }}>Offers & Promo Codes</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Enter coupon (HEAVEN50)" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            style={{ 
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-family)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button 
            onClick={handleApplyCoupon}
            className="btn btn-primary"
            style={{ padding: '0 16px', height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            Apply
          </button>
        </div>
        {couponError && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '6px', fontWeight: '600' }}>{couponError}</p>}
        {couponSuccess && <p style={{ color: 'var(--success)', fontSize: '0.75rem', marginTop: '6px', fontWeight: '600' }}>{couponSuccess}</p>}
      </div>

      {/* Delivery Address */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <MapPin size={20} color="var(--primary)" />
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: '700' }}>Deliver to Home</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.address || '123 Heaven Heights, Sky Lane, Sector 7'}
              </p>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-sub)" />
        </div>
      </div>

      {/* Bill Details */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)',
        padding: '16px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '12px' }}>
          Bill Details
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Item Total</span>
            <span style={{ color: 'var(--text-main)' }}>₹{itemTotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>GST & Restaurant Charges (5%)</span>
            <span style={{ color: 'var(--text-main)' }}>₹{gst}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery Partner Fee</span>
            <span style={{ color: 'var(--text-main)' }}>₹{deliveryCharge}</span>
          </div>
          
          {appliedDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: '600' }}>
              <span>Promo Discount</span>
              <span>-₹{appliedDiscount}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '4px', fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
            <span>Grand Total</span>
            <span>₹{totalBill}</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div style={{
        padding: '12px 0 20px 0',
        backgroundColor: 'var(--bg-container)'
      }}>
        <button 
          onClick={handleCheckout}
          className="btn btn-primary"
          style={{ width: '100%', height: '48px', fontSize: '1rem', borderRadius: '12px' }}
        >
          Proceed to Pay • ₹{totalBill}
        </button>
      </div>
    </div>
  );
};

export default Cart;

