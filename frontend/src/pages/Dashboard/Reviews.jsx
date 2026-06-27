import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/dashboard/reviews');
        setReviews(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading reviews...</div>;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px' }}>Customer Reviews</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ fontWeight: '700', fontSize: '1.1rem' }}>{review.customer_name}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{review.date}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "var(--warning)" : "none"} color={i < review.rating ? "var(--warning)" : "var(--border-color)"} />
                ))}
              </div>
              
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                "{review.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
