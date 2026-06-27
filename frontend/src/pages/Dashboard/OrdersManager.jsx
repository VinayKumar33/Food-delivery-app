import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/dashboard/orders');
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/dashboard/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading orders...</div>;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px' }}>Manage Orders</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Order #{order.id}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleString()}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '8px' }}>
                    <strong>Customer:</strong> {order.customer?.name} ({order.customer?.phone})<br/>
                    <strong>Address:</strong> {order.delivery_address}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>₹{order.total_amount}</span>
                  
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Status Update</label>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="placed">Placed (Pending)</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="on_the_way">On the Way</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px' }}>Items</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                  {order.items?.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--text-sub)' }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersManager;
