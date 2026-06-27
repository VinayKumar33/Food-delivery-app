import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Landmark, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const itemTotal = getCartTotal();
  const gst = Math.round(itemTotal * 0.05);
  const deliveryCharge = 30;
  const originalBill = itemTotal + gst + deliveryCharge;
  const grandTotal = originalBill - appliedDiscount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'HEAVEN50') {
      const discount = Math.round(itemTotal * 0.5);
      setAppliedDiscount(discount);
      setCouponSuccess(`HEAVEN50 applied! You saved ₹${discount}`);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try HEAVEN50');
      setCouponSuccess('');
    }
  };

  const handlePlaceOrder = () => {
    // Generate a random simulated order ID
    const randomOrderId = Math.floor(Math.random() * 900000) + 100000;
    
    // Clear cart context
    clearCart();

    // Navigate to live tracking page
    navigate(`/track/${randomOrderId}`);
  };

  return (
    <div className="checkout-page fade-in" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/cart')}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Payment Modes</h3>
      </div>

      {/* Coupon promo */}
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

      {/* Payment methods */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>Choose Payment Option</h4>
        
        {/* COD Option */}
        <div 
          onClick={() => setPaymentMethod('COD')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
            padding: '16px',
            borderRadius: '16px',
            border: `1.5px solid ${paymentMethod === 'COD' ? 'var(--primary)' : 'var(--border-color)'}`,
            cursor: 'pointer',
            marginBottom: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Truck size={20} color="var(--primary)" />
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Cash on Delivery (COD)</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay at your doorstep with Cash/UPI</p>
            </div>
          </div>
          {paymentMethod === 'COD' && (
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <Check size={12} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Card Option */}
        <div 
          onClick={() => setPaymentMethod('CARD')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
            padding: '16px',
            borderRadius: '16px',
            border: `1.5px solid ${paymentMethod === 'CARD' ? 'var(--primary)' : 'var(--border-color)'}`,
            cursor: 'pointer',
            marginBottom: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CreditCard size={20} color="var(--text-sub)" />
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Credit / Debit Cards</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, MasterCard, RuPay supported</p>
            </div>
          </div>
          {paymentMethod === 'CARD' && (
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <Check size={12} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* UPI Option */}
        <div 
          onClick={() => setPaymentMethod('UPI')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
            padding: '16px',
            borderRadius: '16px',
            border: `1.5px solid ${paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--border-color)'}`,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Landmark size={20} color="var(--text-sub)" />
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Net Banking / UPI</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay instantly via GPay, PhonePe, Paytm</p>
            </div>
          </div>
          {paymentMethod === 'UPI' && (
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <Check size={12} strokeWidth={3} />
            </div>
          )}
        </div>
      </div>

      {/* Bill summary breakdown */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)',
        padding: '16px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <span>Order total</span>
          <span>₹{originalBill}</span>
        </div>
        {appliedDiscount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: '600', marginBottom: '8px' }}>
            <span>Promo Discount</span>
            <span>-₹{appliedDiscount}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
          <span>Amount to Pay</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button 
        onClick={handlePlaceOrder}
        className="btn btn-primary"
        style={{ width: '100%', height: '48px', fontSize: '1rem', borderRadius: '12px' }}
      >
        Place Order via {paymentMethod === 'COD' ? 'COD' : paymentMethod === 'CARD' ? 'Card' : 'UPI'}
      </button>
    </div>
  );
};

export default Checkout;
