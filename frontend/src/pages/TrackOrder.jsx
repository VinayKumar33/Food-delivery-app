import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, MessageSquare, ChevronRight, X } from 'lucide-react';
import logo from '../assets/logo.svg';

const TRACK_STEPS = [
  { status: 'confirmed', label: 'Order Confirmed', time: '11:37 AM', desc: 'Restaurant has accepted your order.' },
  { status: 'preparing', label: 'Restaurant Preparing', time: '11:42 AM', desc: 'Chef is preparing your heavenly meal.' },
  { status: 'picked_up', label: 'Picked Up', time: '11:48 AM', desc: 'Rider has picked up your order.' },
  { status: 'on_the_way', label: 'On the Way', time: '11:52 AM', desc: 'Rider is on the way to your location.' },
  { status: 'delivered', label: 'Delivered', time: '12:02 PM', desc: 'Enjoy your heavenly meal!' }
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Fetch real order details from SQLite backend
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const data = await res.json();
        if (data.status === 'success') {
          setOrderDetails(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }

    // Automatically advance order stage step every 12 seconds for simulation
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < TRACK_STEPS.length - 1) {
          return prevStep + 1;
        }
        clearInterval(interval);
        return prevStep;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="track-order fade-in" style={{ padding: '16px', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order ID: #{orderId || '729104'}</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '2px' }}>Live Tracking</h3>
        </div>
        <button 
          onClick={() => navigate('/')}
          style={{ border: 'none', background: 'var(--bg-surface)', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={18} />
        </button>
      </div>

      {orderDetails && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          {orderDetails.restaurant?.image_url && (
            <img src={orderDetails.restaurant.image_url} alt="Restaurant" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
          )}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{orderDetails.restaurant?.name || 'Restaurant'}</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: ₹{orderDetails.total_amount} • {orderDetails.payment_method}</p>
          </div>
        </div>
      )}

      {/* ETA block */}
      <div style={{ 
        backgroundColor: 'linear-gradient(135deg, #1f1f23 0%, #2e2e36 100%)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: '600' }}>
          Estimated Delivery Time
        </span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '6px 0', color: 'var(--primary)' }}>
          {currentStep === 4 ? 'Delivered!' : '25-30 Mins'}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600' }}>
          <ShieldCheck size={16} /> <span>Your food is arriving hot & fresh</span>
        </div>
      </div>

      {/* Rider Info Card */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'var(--bg-card)', 
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            V
          </div>
          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Vinay Kumar</h5>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your Delivery Partner</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)' }}>
            <Phone size={16} />
          </button>
          <button style={{ border: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)' }}>
            <MessageSquare size={16} />
          </button>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div style={{ flex: 1, paddingLeft: '8px', position: 'relative' }}>
        {TRACK_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} style={{ display: 'flex', gap: '20px', marginBottom: '24px', position: 'relative' }}>
              
              {/* Connector line */}
              {idx < TRACK_STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '24px',
                  bottom: '-24px',
                  width: '2px',
                  backgroundColor: idx < currentStep ? 'var(--primary)' : 'var(--border-color)',
                  transition: 'background-color 0.5s ease',
                  zIndex: 1
                }} />
              )}

              {/* Step indicator dot */}
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? 'var(--primary)' : 'var(--bg-surface)',
                border: `2px solid ${isCurrent ? 'var(--primary)' : 'var(--border-color)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                boxShadow: isCurrent ? '0 0 8px var(--primary)' : 'none',
                transition: 'all 0.5s ease'
              }}>
                {isCompleted && '✓'}
              </div>

              {/* Step details */}
              <div style={{ flex: 1, opacity: isCompleted ? 1 : 0.5, transition: 'opacity 0.5s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: isCurrent ? 'var(--primary)' : 'var(--text-main)' }}>
                    {step.label}
                  </h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{step.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {step.desc}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Brand logo footer */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: 0.5, marginTop: '20px' }}>
        <img src={logo} alt="Logo" style={{ width: '24px', height: '24px' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px' }}>VINAY'S HEAVEN</span>
      </div>
    </div>
  );
};

export default TrackOrder;
