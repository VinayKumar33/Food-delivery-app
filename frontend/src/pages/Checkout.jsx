import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Landmark, Truck, Check, Wallet, Plus, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartRestaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isOrdering, setIsOrdering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Address Management
  const initialAddresses = user?.address 
    ? [{ id: 1, text: user.address }]
    : [{ id: 1, text: '123 Heaven Heights, Sky Lane, Sector 7' }];
    
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressText, setNewAddressText] = useState('');

  const appliedDiscount = location.state?.appliedDiscount || 0;
  const itemTotal = getCartTotal();
  const gst = Math.round(itemTotal * 0.05);
  const deliveryCharge = itemTotal > 0 ? 30 : 0;
  const originalBill = itemTotal + gst + deliveryCharge;
  const grandTotal = originalBill - appliedDiscount;

  const handleAddAddress = () => {
    if (newAddressText.trim()) {
      const newId = Date.now();
      setAddresses([...addresses, { id: newId, text: newAddressText }]);
      setSelectedAddressId(newId);
      setNewAddressText('');
      setIsAddingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsOrdering(true);
    
    try {
      const selectedAddress = addresses.find(a => a.id === selectedAddressId)?.text;
      
      const orderPayload = {
        user_id: user?.id || 1,
        restaurant_id: cartRestaurant?.id || 1,
        total_amount: grandTotal,
        delivery_address: selectedAddress,
        payment_method: paymentMethod,
        items: cartItems.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (data.status === 'success') {
        const orderId = data.data.orderId;
        
        // Show success animation overlay
        setShowSuccess(true);
        
        // Clear cart
        clearCart();

        // Redirect after animation
        setTimeout(() => {
          navigate(`/track/${orderId}`);
        }, 2500);
      } else {
        alert(data.message || 'Failed to place order');
        setIsOrdering(false);
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('An error occurred while placing the order.');
      setIsOrdering(false);
    }
  };

  return (
    <div className="checkout-page fade-in" style={{ padding: '16px', position: 'relative' }}>
      
      {/* Success Overlay Animation */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--bg-container)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            width: '100px', height: '100px',
            backgroundColor: 'var(--success)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '20px',
            animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <Check size={60} strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Order Placed!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Redirecting to live tracking...</p>
          
          <style>{`
            @keyframes popIn {
              0% { transform: scale(0); }
              80% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/cart')}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Checkout</h3>
      </div>

      {/* Address Management */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>Delivery Address</h4>
        
        {addresses.map((addr) => (
          <div 
            key={addr.id}
            onClick={() => setSelectedAddressId(addr.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              backgroundColor: 'var(--bg-card)',
              padding: '16px',
              borderRadius: '16px',
              border: `1.5px solid ${selectedAddressId === addr.id ? 'var(--primary)' : 'var(--border-color)'}`,
              cursor: 'pointer',
              marginBottom: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <MapPin size={20} color={selectedAddressId === addr.id ? 'var(--primary)' : 'var(--text-sub)'} style={{ marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{addr.text}</p>
            </div>
            {selectedAddressId === addr.id && (
              <div style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <Check size={12} strokeWidth={3} />
              </div>
            )}
          </div>
        ))}

        {!isAddingAddress ? (
          <button 
            onClick={() => setIsAddingAddress(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--primary)', 
              background: 'none', 
              border: 'none', 
              fontSize: '0.85rem', 
              fontWeight: '600',
              cursor: 'pointer',
              padding: '8px 0'
            }}
          >
            <Plus size={16} /> Add New Address
          </button>
        ) : (
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            padding: '16px', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)'
          }}>
            <textarea 
              value={newAddressText}
              onChange={(e) => setNewAddressText(e.target.value)}
              placeholder="Enter full address..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                minHeight: '80px',
                marginBottom: '12px',
                outline: 'none',
                resize: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleAddAddress}
                className="btn btn-primary"
                style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                Save Address
              </button>
              <button 
                onClick={() => setIsAddingAddress(false)}
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  borderRadius: '8px', 
                  fontSize: '0.85rem',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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
            <Truck size={20} color={paymentMethod === 'COD' ? 'var(--primary)' : 'var(--text-sub)'} />
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
            <CreditCard size={20} color={paymentMethod === 'CARD' ? 'var(--primary)' : 'var(--text-sub)'} />
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
            marginBottom: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Landmark size={20} color={paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--text-sub)'} />
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

        {/* Wallet Option */}
        <div 
          onClick={() => setPaymentMethod('WALLET')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
            padding: '16px',
            borderRadius: '16px',
            border: `1.5px solid ${paymentMethod === 'WALLET' ? 'var(--primary)' : 'var(--border-color)'}`,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wallet size={20} color={paymentMethod === 'WALLET' ? 'var(--primary)' : 'var(--text-sub)'} />
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Wallets</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amazon Pay, MobiKwik, Freecharge</p>
            </div>
          </div>
          {paymentMethod === 'WALLET' && (
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
        disabled={isOrdering}
        className="btn btn-primary"
        style={{ width: '100%', height: '48px', fontSize: '1rem', borderRadius: '12px', opacity: isOrdering ? 0.7 : 1 }}
      >
        {isOrdering ? 'Placing Order...' : `Place Order via ${paymentMethod === 'COD' ? 'COD' : paymentMethod === 'CARD' ? 'Card' : paymentMethod === 'WALLET' ? 'Wallet' : 'UPI'}`}
      </button>
    </div>
  );
};

export default Checkout;

