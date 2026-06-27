import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px' }}>Dashboard Overview</h2>
      
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Revenue Card */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: '#3b82f6' }}>
              <IndianRupee size={24} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> +12%</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Today's Revenue</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{stats?.revenue || 0}</h3>
        </div>

        {/* Pending Orders */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px', color: '#f59e0b' }}>
              <Clock size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pending Orders</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{stats?.pendingOrders || 0}</h3>
        </div>

        {/* Completed Orders */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', color: '#10b981' }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Completed Orders</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{stats?.completedOrders || 0}</h3>
        </div>

      </div>

      {/* Popular Items Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Top Selling Items</h3>
        
        {stats?.popularItems?.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ paddingBottom: '12px' }}>Item Name</th>
                <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {stats.popularItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 0', fontSize: '0.95rem', fontWeight: '600' }}>{item.name}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: '700', color: 'var(--primary)' }}>{item.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No sales data available yet.</p>
        )}
      </div>

    </div>
  );
};

export default Overview;
