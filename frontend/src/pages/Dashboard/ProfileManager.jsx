import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', cuisine: '', delivery_time: 30, cost_for_two: 300, delivery_fee: 0, image_url: '', address: ''
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/dashboard/profile');
      if (res.data.data) {
        const p = res.data.data;
        setFormData({
          name: p.name || '',
          cuisine: p.cuisine || '',
          delivery_time: p.delivery_time || 30,
          cost_for_two: p.cost_for_two || 300,
          delivery_fee: p.delivery_fee || 0,
          image_url: p.image_url || '',
          address: p.address || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/dashboard/profile', formData);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px' }}>Restaurant Profile</h2>
      
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', maxWidth: '800px' }}>
        
        {formData.image_url && (
          <div style={{ marginBottom: '24px' }}>
            <img src={formData.image_url} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <span className="input-label">Restaurant Name</span>
            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <span className="input-label">Cover Image URL</span>
            <input type="url" className="input-field" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <span className="input-label">Cuisines (comma separated)</span>
            <input type="text" className="input-field" value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} required />
          </div>

          <div className="input-group">
            <span className="input-label">Delivery Time (mins)</span>
            <input type="number" className="input-field" value={formData.delivery_time} onChange={e => setFormData({...formData, delivery_time: Number(e.target.value)})} required />
          </div>

          <div className="input-group">
            <span className="input-label">Cost for Two (₹)</span>
            <input type="number" className="input-field" value={formData.cost_for_two} onChange={e => setFormData({...formData, cost_for_two: Number(e.target.value)})} required />
          </div>

          <div className="input-group">
            <span className="input-label">Delivery Fee (₹)</span>
            <input type="number" className="input-field" value={formData.delivery_fee} onChange={e => setFormData({...formData, delivery_fee: Number(e.target.value)})} required />
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <span className="input-label">Address</span>
            <textarea className="input-field" rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '14px 32px', borderRadius: '12px' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileManager;
