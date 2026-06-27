import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin, ChevronDown, Search, Bell, Star, Clock, ChevronRight,
  Bike, SlidersHorizontal, Flame, Award, Navigation, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

// ─── Promotional Banners ────────────────────────────────────────────────────
const BANNERS = [
  {
    id: 1,
    title: 'Get 50% Off Your First Feast',
    subtitle: 'Use code: HEAVEN50',
    bg: 'linear-gradient(135deg, #e23744 0%, #801018 100%)',
    emoji: '🍔',
    badge: 'New User Offer'
  },
  {
    id: 2,
    title: 'Free Delivery on ₹250+',
    subtitle: 'Valid on all restaurants today',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    emoji: '🛵',
    badge: 'Limited Time'
  },
  {
    id: 3,
    title: 'Biryani Bonanza — 40% OFF',
    subtitle: 'Up to ₹120 off on all biryanis',
    bg: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
    emoji: '🍲',
    badge: 'Today Only'
  }
];

// ─── Food Categories ─────────────────────────────────────────────────────────
const FOOD_CATEGORIES = [
  { name: 'Pizza', icon: '🍕', search: 'Pizza' },
  { name: 'Biryani', icon: '🍲', search: 'Biryani' },
  { name: 'Burgers', icon: '🍔', search: 'Burgers' },
  { name: 'Chinese', icon: '🥢', search: 'Chinese' },
  { name: 'South Indian', icon: '🥞', search: 'South Indian' },
  { name: 'Desserts', icon: '🍰', search: 'Desserts' },
  { name: 'Drinks', icon: '🥤', search: 'Beverages' },
  { name: 'Healthy', icon: '🥗', search: 'Salads' },
  { name: 'Rolls', icon: '🌯', search: 'Rolls' },
  { name: 'Italian', icon: '🍝', search: 'Italian' }
];

// ─── Search Suggestions ──────────────────────────────────────────────────────
const SEARCH_SUGGESTIONS = [
  'Chicken Biryani', 'Paneer Butter Masala', 'Masala Dosa', 'Veg Burger',
  'Chocolate Cake', 'Chilly Paneer', 'Hakka Noodles', 'Margherita Pizza'
];

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────
const RestaurantCardSkeleton = () => (
  <div style={{
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)', marginBottom: 20
  }}>
    <div className="shimmer" style={{ height: 175, width: '100%' }} />
    <div style={{ padding: 16 }}>
      <div className="shimmer" style={{ height: 16, borderRadius: 8, marginBottom: 10, width: '65%' }} />
      <div className="shimmer" style={{ height: 12, borderRadius: 8, marginBottom: 10, width: '50%' }} />
      <div className="shimmer" style={{ height: 12, borderRadius: 8, width: '80%' }} />
    </div>
  </div>
);

const HorizontalCardSkeleton = () => (
  <div style={{
    minWidth: 190, borderRadius: 16, overflow: 'hidden',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)', flexShrink: 0
  }}>
    <div className="shimmer" style={{ height: 120, width: '100%' }} />
    <div style={{ padding: 12 }}>
      <div className="shimmer" style={{ height: 13, borderRadius: 8, marginBottom: 8, width: '70%' }} />
      <div className="shimmer" style={{ height: 11, borderRadius: 8, width: '55%' }} />
    </div>
  </div>
);

// ─── Restaurant Card (Vertical Full Width) ───────────────────────────────────
const RestaurantCard = ({ restaurant, onClick }) => (
  <div
    onClick={() => onClick(restaurant.id)}
    className="tap-effect"
    style={{
      borderRadius: 20, overflow: 'hidden',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: 20, cursor: 'pointer'
    }}
  >
    {/* Banner Image */}
    <div style={{ height: 175, width: '100%', position: 'relative', overflow: 'hidden' }}>
      <img
        src={restaurant.image_url}
        alt={restaurant.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
      {/* Offer badge */}
      {restaurant.promo_text && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          background: 'var(--primary)', color: 'white',
          padding: '5px 10px', borderRadius: 8,
          fontWeight: 700, fontSize: '0.75rem',
          boxShadow: '0 2px 8px rgba(226,55,68,0.35)'
        }}>
          {restaurant.promo_text}
        </div>
      )}
      {/* Delivery fee badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: restaurant.delivery_fee === 0
          ? 'rgba(36,155,85,0.92)'
          : 'rgba(0,0,0,0.65)',
        color: 'white',
        padding: '4px 8px', borderRadius: 6,
        fontWeight: 700, fontSize: '0.7rem', backdropFilter: 'blur(4px)'
      }}>
        {restaurant.delivery_fee === 0 ? 'FREE Delivery' : `₹${restaurant.delivery_fee} del.`}
      </div>
    </div>

    {/* Card Body */}
    <div style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ flex: 1, paddingRight: 8 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 2 }}>
            {restaurant.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {restaurant.cuisine}
          </p>
        </div>
        <div className="rating-badge" style={{ flexShrink: 0 }}>
          {restaurant.rating} <Star size={11} fill="white" color="white" />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        borderTop: '1px solid var(--border-color)', marginTop: 10, paddingTop: 10,
        display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--text-sub)', alignItems: 'center'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={13} /> {restaurant.delivery_time} min
        </span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Navigation size={13} /> {restaurant.distance} km
        </span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span>₹{restaurant.cost_for_two} for 2</span>
      </div>
    </div>
  </div>
);

// ─── Horizontal Scroll Restaurant Card ──────────────────────────────────────
const HRestaurantCard = ({ restaurant, onClick }) => (
  <div
    onClick={() => onClick(restaurant.id)}
    className="tap-effect"
    style={{
      minWidth: 200, maxWidth: 200, borderRadius: 16,
      overflow: 'hidden', backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)', cursor: 'pointer', flexShrink: 0
    }}
  >
    <div style={{ height: 115, width: '100%', position: 'relative', overflow: 'hidden' }}>
      <img
        src={restaurant.image_url}
        alt={restaurant.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {restaurant.promo_text && (
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'var(--primary)', color: 'white',
          padding: '3px 8px', borderRadius: 6,
          fontWeight: 700, fontSize: '0.65rem'
        }}>
          {restaurant.promo_text}
        </div>
      )}
    </div>
    <div style={{ padding: '10px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
          {restaurant.name}
        </h5>
        <div className="rating-badge" style={{ fontSize: '0.65rem', padding: '2px 5px', borderRadius: 4, flexShrink: 0 }}>
          {restaurant.rating} <Star size={9} fill="white" color="white" />
        </div>
      </div>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>
        {restaurant.cuisine}
      </p>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span><Clock size={11} /> {restaurant.delivery_time}m</span>
        <span>•</span>
        <span><Navigation size={11} /> {restaurant.distance}km</span>
      </div>
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle, onSeeAll }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{title}</h3>
      </div>
      {subtitle && <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
    </div>
    {onSeeAll && (
      <button
        onClick={onSeeAll}
        style={{
          border: 'none', background: 'none', cursor: 'pointer',
          color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem',
          display: 'flex', alignItems: 'center', gap: 3
        }}
      >
        See all <ChevronRight size={14} />
      </button>
    )}
  </div>
);

// ─── Home Page ────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterVeg, setFilterVeg] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  const searchRef = useRef(null);

  // ── Auto-advance banner carousel ─────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setBannerIdx(prev => (prev + 1) % BANNERS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  // ── Fetch all restaurants on mount ───────────────────────────────────────
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/restaurants');
        if (res.data && res.data.success) {
          setAllRestaurants(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // ── Close suggestions on outside click ───────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Filtered restaurant list ──────────────────────────────────────────────
  const filtered = allRestaurants.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q
      || r.name.toLowerCase().includes(q)
      || r.cuisine.toLowerCase().includes(q);
    const matchCat = !selectedCategory
      || r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchVeg = !filterVeg
      || r.cuisine.toLowerCase().includes('veg')
      || r.name.toLowerCase().includes('veg');
    return matchSearch && matchCat && matchVeg;
  });

  // ── Section slices from filtered ─────────────────────────────────────────
  const recommended = [...allRestaurants].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const topRated    = allRestaurants.filter(r => r.rating >= 4.3).slice(0, 5);
  const trending    = allRestaurants.filter(r => r.promo_text).slice(0, 4);
  const nearby      = allRestaurants.filter(r => r.distance <= 2.2);

  const goToRestaurant = useCallback((id) => navigate(`/restaurant/${id}`), [navigate]);

  const handleSuggestionClick = (s) => {
    setSearchQuery(s);
    setShowSuggestions(false);
  };

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-container)' }}>

      {/* ──── STICKY TOP BAR ──── */}
      <div style={{
        padding: '14px 16px 10px',
        background: 'var(--bg-container)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky', top: 0, zIndex: 30
      }}>
        {/* Row 1: Location + Logo + Bell */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
            <MapPin size={18} color="var(--primary)" strokeWidth={2.5} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {user ? 'Home' : 'Deliver to'}
                </span>
                <ChevronDown size={14} color="var(--primary)" strokeWidth={2.5} />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                123 Heaven Heights, Sky Lane, Sector 7
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ border: 'none', background: 'var(--bg-surface)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="var(--text-sub)" />
            </button>
            <img src={logo} alt="Vinay's Heaven" style={{ width: 36, height: 36 }} />
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <div ref={searchRef} style={{ position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 14, padding: '11px 14px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'border-color 0.2s ease'
          }}
            onFocus={() => setShowSuggestions(true)}
          >
            <Search size={18} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search for restaurants or food..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); setSelectedCategory(null); }}
              onFocus={() => setShowSuggestions(true)}
              style={{
                border: 'none', background: 'none', outline: 'none',
                width: '100%', fontFamily: 'var(--font-family)',
                color: 'var(--text-main)', fontSize: '0.9rem'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-sub)', padding: 0 }}
              >✕</button>
            )}
            <SlidersHorizontal size={16} color="var(--text-sub)" style={{ cursor: 'pointer' }} />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {filteredSuggestions.map((s, i) => (
                <div key={i} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>
                  <Search size={14} color="var(--text-sub)" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ──── SCROLLABLE CONTENT ──── */}
      <div style={{ padding: '0 0 16px 0' }}>

        {/* ── Promo Banner Carousel ── */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => navigate('/')}>
            {BANNERS.map((banner, idx) => (
              <div
                key={banner.id}
                style={{
                  background: banner.bg,
                  padding: '20px 22px',
                  borderRadius: 20,
                  color: 'white',
                  position: idx === 0 ? 'relative' : 'absolute',
                  top: 0, left: 0, right: 0,
                  opacity: idx === bannerIdx ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                  pointerEvents: idx === bannerIdx ? 'auto' : 'none',
                  boxShadow: 'var(--shadow-md)',
                  overflow: 'hidden',
                  minHeight: 120
                }}
              >
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: 20, padding: '3px 10px',
                    fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.5px', marginBottom: 8
                  }}>
                    {banner.badge}
                  </span>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: 6 }}>{banner.title}</h2>
                  <p style={{ fontSize: '0.78rem', opacity: 0.9 }}>{banner.subtitle}</p>
                </div>
                <div style={{ position: 'absolute', right: -10, bottom: -10, fontSize: 80, opacity: 0.18 }}>
                  {banner.emoji}
                </div>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            {BANNERS.map((_, i) => (
              <div
                key={i}
                onClick={() => setBannerIdx(i)}
                style={{
                  width: i === bannerIdx ? 20 : 6, height: 6,
                  borderRadius: 3,
                  background: i === bannerIdx ? 'var(--primary)' : 'var(--border-color)',
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Food Categories ── */}
        <div style={{ padding: '20px 16px 4px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 14 }}>What's on your mind?</h3>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {FOOD_CATEGORIES.map(cat => (
              <div
                key={cat.name}
                className="tap-effect"
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.search ? null : cat.search);
                  setSearchQuery('');
                }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 66, cursor: 'pointer' }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: selectedCategory === cat.search
                    ? 'rgba(226,55,68,0.1)'
                    : 'var(--bg-surface)',
                  border: `2px solid ${selectedCategory === cat.search ? 'var(--primary)' : 'var(--border-color)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, marginBottom: 7,
                  boxShadow: selectedCategory === cat.search ? '0 4px 12px rgba(226,55,68,0.2)' : 'var(--shadow-sm)',
                  transition: 'all 0.25s ease'
                }}>
                  {cat.icon}
                </div>
                <span style={{
                  fontSize: '0.72rem', fontWeight: selectedCategory === cat.search ? 700 : 500,
                  color: selectedCategory === cat.search ? 'var(--primary)' : 'var(--text-main)',
                  textAlign: 'center', lineHeight: 1.2
                }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Filters ── */}
        <div style={{ padding: '12px 16px 0', display: 'flex', gap: 8, flexWrap: 'nowrap', overflowX: 'auto' }} className="no-scrollbar">
          {[
            { label: '🥬 Pure Veg', active: filterVeg, toggle: () => setFilterVeg(f => !f) },
            { label: '⭐ Rating 4.3+', active: false, toggle: () => {} },
            { label: '⚡ Fast Delivery', active: false, toggle: () => {} },
            { label: '🎁 Offers', active: false, toggle: () => {} }
          ].map(f => (
            <button
              key={f.label}
              onClick={f.toggle}
              style={{
                padding: '7px 14px', borderRadius: 20, flexShrink: 0,
                border: `1.5px solid ${f.active ? 'var(--primary)' : 'var(--border-color)'}`,
                background: f.active ? 'rgba(226,55,68,0.08)' : 'var(--bg-card)',
                color: f.active ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', outline: 'none'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ───────── SHOW SEARCH/FILTER RESULTS ───────── */}
        {(searchQuery || selectedCategory || filterVeg) ? (
          <div style={{ padding: '20px 16px 0' }}>
            <SectionHeader
              icon={<Search size={17} color="var(--primary)" />}
              title={`Results (${filtered.length})`}
              subtitle={searchQuery || selectedCategory || 'Filtered list'}
            />
            {loading
              ? [1, 2, 3].map(i => <RestaurantCardSkeleton key={i} />)
              : filtered.length === 0
                ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-sub)' }}>
                    <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>🍽️</p>
                    <p style={{ fontWeight: 700 }}>No matches found</p>
                    <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Try a different search or filter</p>
                  </div>
                )
                : filtered.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={goToRestaurant} />)
            }
          </div>
        ) : (
          <>
            {/* ── Recommended For You (horizontal scroll) ── */}
            <div style={{ padding: '22px 0 0' }}>
              <div style={{ padding: '0 16px' }}>
                <SectionHeader
                  icon={<Sparkles size={17} color="var(--accent-gold)" />}
                  title="Recommended For You"
                  subtitle="Based on top ratings in your area"
                  onSeeAll={() => navigate('/search')}
                />
              </div>
              <div className="no-scrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 16px 4px' }}>
                {loading
                  ? [1, 2, 3].map(i => <HorizontalCardSkeleton key={i} />)
                  : recommended.map(r => <HRestaurantCard key={r.id} restaurant={r} onClick={goToRestaurant} />)
                }
              </div>
            </div>

            {/* ── Top Rated (horizontal scroll) ── */}
            {!loading && topRated.length > 0 && (
              <div style={{ padding: '24px 0 0' }}>
                <div style={{ padding: '0 16px' }}>
                  <SectionHeader
                    icon={<Award size={17} color="var(--success)" />}
                    title="Top Rated Restaurants"
                    subtitle="Restaurants with rating 4.3 and above"
                    onSeeAll={() => navigate('/search')}
                  />
                </div>
                <div className="no-scrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 16px 4px' }}>
                  {topRated.map(r => <HRestaurantCard key={r.id} restaurant={r} onClick={goToRestaurant} />)}
                </div>
              </div>
            )}

            {/* ── Mini promo strip ── */}
            <div style={{ padding: '22px 16px 0' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: 16, padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', boxShadow: 'var(--shadow-md)'
              }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', fontWeight: 600, marginBottom: 4, letterSpacing: '0.5px' }}>
                    HEAVENLY OFFER
                  </p>
                  <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>
                    Flat ₹50 off on 1st order
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: 3 }}>Code: HEAVEN50</p>
                </div>
                <div style={{ fontSize: 48, opacity: 0.7 }}>🎁</div>
              </div>
            </div>

            {/* ── Trending Restaurants (vertical) ── */}
            <div style={{ padding: '24px 16px 0' }}>
              <SectionHeader
                icon={<Flame size={17} color="var(--primary)" />}
                title="Trending Restaurants"
                subtitle="Most ordered from in your area today"
                onSeeAll={() => navigate('/search')}
              />
              {loading
                ? [1, 2].map(i => <RestaurantCardSkeleton key={i} />)
                : trending.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={goToRestaurant} />)
              }
            </div>

            {/* ── Nearby Restaurants (vertical) ── */}
            <div style={{ padding: '8px 16px 0' }}>
              <SectionHeader
                icon={<Bike size={17} color="var(--accent)" />}
                title="Nearby Restaurants"
                subtitle="Within 2.2 km of your location"
                onSeeAll={() => navigate('/search')}
              />
              {loading
                ? [1, 2].map(i => <RestaurantCardSkeleton key={i} />)
                : nearby.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={goToRestaurant} />)
              }
            </div>

            {/* ── All Restaurants ── */}
            <div style={{ padding: '8px 16px 0' }}>
              <SectionHeader
                icon={<Search size={17} color="var(--text-muted)" />}
                title="All Restaurants"
                subtitle={`${allRestaurants.length} restaurants near you`}
              />
              {loading
                ? [1, 2, 3].map(i => <RestaurantCardSkeleton key={i} />)
                : allRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={goToRestaurant} />)
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
