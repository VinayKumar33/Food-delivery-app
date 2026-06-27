import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const MenuManager = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', image_url: '', category: '', is_veg: 1
  });

  const fetchMenu = async () => {
    try {
      const res = await axios.get('/api/dashboard/menu');
      setMenu(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', image_url: '', category: '', is_veg: 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ 
      name: item.name, 
      description: item.description, 
      price: item.price, 
      image_url: item.image_url, 
      category: item.category, 
      is_veg: item.is_veg 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/api/dashboard/menu/${id}`);
        fetchMenu();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/dashboard/menu/${editingId}`, formData);
      } else {
        await axios.post('/api/dashboard/menu', formData);
      }
      setIsModalOpen(false);
      fetchMenu();
    } catch (err) {
      alert('Save failed');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading menu...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Manage Menu</h2>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px' }}>
          <Plus size={18} /> Add New Item
        </button>
      </div>
      
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead style={{ backgroundColor: 'var(--bg-card)' }}>
              <tr style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Image</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Name</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Category</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Price</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No items in menu.</td></tr>
              ) : (
                menu.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px' }}>
                      <img src={item.image_url || 'https://via.placeholder.com/60'} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.is_veg ? 'var(--success)' : 'var(--error)', display: 'inline-block' }} />
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.description}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.85rem' }}>{item.category}</td>
                    <td style={{ padding: '16px', fontWeight: '700' }}>₹{item.price}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button onClick={() => openEditModal(item)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '8px' }}>
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '8px', marginLeft: '8px' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-main)', width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '24px', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
            
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px' }}>
              {editingId ? 'Edit Food Item' : 'Add Food Item'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="input-group">
                <span className="input-label">Item Name</span>
                <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div className="input-group">
                <span className="input-label">Description</span>
                <textarea className="input-field" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <span className="input-label">Price (₹)</span>
                  <input type="number" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <span className="input-label">Category</span>
                  <input type="text" className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required placeholder="e.g. Starters" />
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Image URL</span>
                <input type="url" className="input-field" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} required placeholder="https://..." />
              </div>

              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <input type="checkbox" checked={formData.is_veg === 1} onChange={e => setFormData({...formData, is_veg: e.target.checked ? 1 : 0})} style={{ width: '18px', height: '18px', accentColor: 'var(--success)' }} />
                  This is a Vegetarian item
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '10px' }}>
                {editingId ? 'Save Changes' : 'Add Item'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default MenuManager;
