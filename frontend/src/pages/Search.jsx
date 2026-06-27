import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search as SearchIcon, ArrowLeft, Star, Clock, ShieldAlert } from 'lucide-react';

const Search = () => {
  const navigate = useNavigate();
  const [queryVal, setQueryVal] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const popularSearches = ['Pizza', 'Biryani', 'Burgers', 'Chinese', 'Desserts'];

  useEffect(() => {
    if (queryVal.trim() === '') {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 400); // Debounce search requests

    return () => clearTimeout(delayDebounceFn);
  }, [queryVal]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/restaurants', {
        params: { search: queryVal }
      });
      if (res.data && res.data.success) {
        setResults(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (keyword) => {
    setQueryVal(keyword);
  };

  return (
    <div className="search-page fade-in" style={{ padding: '16px' }}>
      {/* Search Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <ArrowLeft size={22} />
        </button>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '10px 14px',
          gap: '10px',
          flex: 1
        }}>
          <SearchIcon size={18} color="var(--primary)" />
          <input 
            type="text" 
            placeholder="Search restaurants, cuisines, or items..."
            value={queryVal}
            onChange={(e) => setQueryVal(e.target.value)}
            autoFocus
            style={{ 
              border: 'none', 
              background: 'none', 
              outline: 'none', 
              width: '100%', 
              fontFamily: 'var(--font-family)',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {/* Dynamic Results */}
      {queryVal.trim() !== '' ? (
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
              <div style={{
                width: '28px',
                height: '28px',
                border: '3px solid var(--border-color)',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
                animation: 'splash-spin 1s linear infinite'
              }} />
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-sub)' }}>
              <ShieldAlert size={36} style={{ marginBottom: '8px', color: 'var(--primary)' }} />
              <p>No results found for "{queryVal}"</p>
            </div>
          ) : (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '14px', color: 'var(--text-muted)' }}>
                Matching Restaurants ({results.length})
              </h4>
              {results.map((res) => (
                <div 
                  key={res.id}
                  onClick={() => navigate(`/restaurant/${res.id}`)}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <img 
                    src={res.image_url} 
                    alt={res.name}
                    style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{res.name}</h5>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{res.cuisine}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: 'var(--text-sub)', alignItems: 'center' }}>
                      <div className="rating-badge" style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
                        {res.rating} <Star size={10} fill="white" color="white" />
                      </div>
                      <span>⏱️ {res.delivery_time}m</span>
                      <span>🚴 ₹{res.delivery_fee} del.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Popular suggestions when input is empty */
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>
            Popular Searches
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {popularSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(search)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
