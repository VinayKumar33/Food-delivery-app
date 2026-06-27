import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Search, Star, Clock, Bike, Navigation2, Info,
  ChevronRight, Sparkles, Plus, Minus, ShoppingCart, Heart,
  Share2, MapPin, X, ChevronDown, Phone, UtensilsCrossed
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// ─── Veg / Non-Veg Icon ──────────────────────────────────────────────────────
const DietIcon = ({ isVeg, size = 16 }) => (
  <div style={{
    width: size, height: size,
    border: `1.5px solid ${isVeg ? 'var(--success)' : 'var(--error)'}`,
    borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  }}>
    {isVeg
      ? <div style={{ width: size * 0.45, height: size * 0.45, borderRadius: '50%', backgroundColor: 'var(--success)' }} />
      : <div style={{
          width: 0, height: 0,
          borderLeft: `${size * 0.28}px solid transparent`,
          borderRight: `${size * 0.28}px solid transparent`,
          borderBottom: `${size * 0.45}px solid var(--error)`
        }} />
    }
  </div>
);

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────
const MenuItemSkeleton = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ flex: 1 }}>
      <div className="shimmer" style={{ height: 12, borderRadius: 6, marginBottom: 8, width: '60%' }} />
      <div className="shimmer" style={{ height: 12, borderRadius: 6, marginBottom: 8, width: '35%' }} />
      <div className="shimmer" style={{ height: 10, borderRadius: 6, width: '85%' }} />
    </div>
    <div className="shimmer" style={{ width: 90, height: 90, borderRadius: 12, flexShrink: 0 }} />
  </div>
);

// ─── Quantity Control ─────────────────────────────────────────────────────────
const QtyControl = ({ qty, onAdd, onRemove }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'white',
    border: '1.5px solid var(--primary)',
    borderRadius: 8, overflow: 'hidden',
    width: 84, height: 34, flexShrink: 0
  }}>
    <button onClick={onRemove} style={{
      border: 'none', background: 'none', width: 28, height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'var(--primary)'
    }}>
      <Minus size={13} strokeWidth={2.5} />
    </button>
    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>{qty}</span>
    <button onClick={onAdd} style={{
      border: 'none', background: 'none', width: 28, height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'var(--primary)'
    }}>
      <Plus size={13} strokeWidth={2.5} />
    </button>
  </div>
);

// ─── Add Button ───────────────────────────────────────────────────────────────
const AddButton = ({ onClick }) => (
  <button onClick={onClick} style={{
    border: '1.5px solid var(--primary)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--primary)',
    borderRadius: 8, width: 84, height: 34,
    fontWeight: 800, fontSize: '0.85rem',
    cursor: 'pointer', outline: 'none',
    letterSpacing: '0.5px',
    transition: 'all 0.15s ease'
  }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--primary)'; }}
  >
    ADD
  </button>
);

// ─── Food Item Card ───────────────────────────────────────────────────────────
const FoodCard = ({ item, qty, onAdd, onRemove }) => (
  <div style={{
    display: 'flex', gap: 14, padding: '18px 0',
    borderBottom: '1px solid var(--border-color)', position: 'relative'
  }}>
    {/* Left details */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <DietIcon isVeg={item.is_veg === 1} />
        {item.is_best_seller === 1 && (
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, color: '#d97706',
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217,119,6,0.25)',
            padding: '2px 7px', borderRadius: 4,
            display: 'inline-flex', alignItems: 'center', gap: 3
          }}>
            <Sparkles size={8} /> BESTSELLER
          </span>
        )}
      </div>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
        {item.name}
      </h4>
      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
        ₹{item.price}
      </p>
      {item.description && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '95%' }}>
          {item.description}
        </p>
      )}
    </div>

    {/* Right: image + add control */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <div style={{ width: 100, height: 100, borderRadius: 14, overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-surface)' }}>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            🍽️
          </div>
        )}
      </div>
      {qty > 0
        ? <QtyControl qty={qty} onAdd={onAdd} onRemove={onRemove} />
        : <AddButton onClick={onAdd} />
      }
    </div>
  </div>
);

// ─── Cart Conflict Modal ──────────────────────────────────────────────────────
const CartConflictModal = ({ conflict, onCancel, onForce }) => (
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex',
    alignItems: 'flex-end', zIndex: 200, backdropFilter: 'blur(2px)'
  }}>
    <div className="slide-up" style={{
      backgroundColor: 'var(--bg-container)', width: '100%',
      padding: '24px 20px', borderTopLeftRadius: 24, borderTopRightRadius: 24,
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Replace cart items?
        </h4>
        <button onClick={onCancel} style={{ border: 'none', background: 'var(--bg-surface)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={14} color="var(--text-sub)" />
        </button>
      </div>
      <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 20 }}>
        {conflict.message}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: 12 }}>
          Keep existing
        </button>
        <button onClick={onForce} className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: 12 }}>
          Clear & Add
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, cartRestaurant } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const categoryRefs = useRef({});
  const stickyRef = useRef(null);

  // ── Fetch restaurant + menu ───────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/restaurants/${id}`);
        if (res.data && res.data.success) {
          setRestaurant(res.data.data);
          setMenu(res.data.data.menu || []);
          if (res.data.data.menu?.length > 0) {
            const cats = [...new Set(res.data.data.menu.map(m => m.category).filter(Boolean))];
            setActiveCategory(cats[0] || null);
          }
        }
      } catch (err) {
        setError('Failed to load restaurant. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const categories = [...new Set(menu.map(m => m.category).filter(Boolean))];

  const filteredMenu = menu.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || item.name.toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q);
    const matchVeg = !vegOnly || item.is_veg === 1;
    return matchSearch && matchVeg;
  });

  const groupedMenu = categories.reduce((acc, cat) => {
    const items = filteredMenu.filter(i => i.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // ── Qty helpers ───────────────────────────────────────────────────────────
  const getQty = (itemId) => {
    const found = cartItems.find(c => c.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleAdd = useCallback((item) => {
    const result = addToCart(item, restaurant);
    if (result?.conflict) setConflict(result);
  }, [addToCart, restaurant]);

  const handleRemove = useCallback((item) => {
    removeFromCart(item.id);
  }, [removeFromCart]);

  // ── Scroll to category ────────────────────────────────────────────────────
  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    const el = categoryRefs.current[cat];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ── Open status (mock: always open 8am-11pm) ─────────────────────────────
  const isOpen = () => {
    const h = new Date().getHours();
    return h >= 8 && h < 23;
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="fade-in">
      <div className="shimmer" style={{ height: 220, width: '100%' }} />
      <div style={{ padding: '20px 16px' }}>
        <div className="shimmer" style={{ height: 20, borderRadius: 8, width: '55%', marginBottom: 10 }} />
        <div className="shimmer" style={{ height: 14, borderRadius: 8, width: '70%', marginBottom: 10 }} />
        <div className="shimmer" style={{ height: 14, borderRadius: 8, width: '45%' }} />
        <div style={{ marginTop: 24 }}>
          {[1, 2, 3, 4].map(i => <MenuItemSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  if (error || !restaurant) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: 'var(--error)', fontSize: '0.9rem' }}>{error || 'Restaurant not found.'}</p>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  return (
    <div className="restaurant-details-page" style={{ position: 'relative', minHeight: '100%', background: 'var(--bg-container)' }}>

      {/* ──── HERO BANNER ──── */}
      <div style={{ height: 230, width: '100%', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {restaurant.image_url
          ? <img src={restaurant.image_url} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e23744 0%, #801018 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>🍽️</div>
        }

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 45%, rgba(0,0,0,0.65) 100%)'
        }} />

        {/* Top actions */}
        <div style={{
          position: 'absolute', top: 14, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 14px'
        }}>
          <button onClick={() => navigate('/')} style={{
            border: 'none', background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
            borderRadius: '50%', width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white'
          }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setLiked(l => !l)} style={{
              border: 'none', background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(6px)',
              borderRadius: '50%', width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <Heart size={18} fill={liked ? '#e23744' : 'none'} color={liked ? '#e23744' : 'white'} />
            </button>
            <button style={{
              border: 'none', background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(6px)',
              borderRadius: '50%', width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white'
            }}>
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Restaurant Logo */}
        <div style={{
          position: 'absolute', bottom: -28, left: 20,
          width: 60, height: 60, borderRadius: 14,
          border: '2.5px solid var(--bg-container)',
          overflow: 'hidden', backgroundColor: 'white',
          boxShadow: 'var(--shadow-md)'
        }}>
          {restaurant.image_url
            ? <img src={restaurant.image_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.4rem' }}>
                {restaurant.name?.charAt(0)}
              </div>
          }
        </div>
      </div>

      {/* ──── INFO CARD ──── */}
      <div style={{
        padding: '36px 16px 16px',
        borderBottom: '6px solid var(--bg-surface)',
        background: 'var(--bg-container)'
      }}>
        {/* Name + status row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ flex: 1, paddingRight: 8 }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {restaurant.name}
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {restaurant.cuisine}
            </p>
          </div>
          <div style={{
            flexShrink: 0,
            backgroundColor: isOpen() ? 'var(--success)' : 'var(--error)',
            color: 'white',
            borderRadius: 6, padding: '3px 9px',
            fontSize: '0.7rem', fontWeight: 700
          }}>
            {isOpen() ? 'OPEN' : 'CLOSED'}
          </div>
        </div>

        {/* Rating + reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div className="rating-badge" style={{ borderRadius: 6 }}>
            {restaurant.rating} <Star size={11} fill="white" color="white" />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {Math.floor(restaurant.rating * 200 + 50)} reviews
          </span>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ₹{restaurant.cost_for_two} for two
          </span>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 1, borderRadius: 14, overflow: 'hidden',
          border: '1px solid var(--border-color)',
          marginBottom: 14
        }}>
          {[
            { icon: <Clock size={16} color="var(--primary)" />, label: `${restaurant.delivery_time} min`, sub: 'Delivery Time' },
            { icon: <Bike size={16} color="var(--primary)" />, label: restaurant.delivery_fee === 0 ? 'FREE' : `₹${restaurant.delivery_fee}`, sub: 'Delivery Fee' },
            { icon: <Navigation2 size={16} color="var(--primary)" />, label: `${restaurant.distance} km`, sub: 'Distance' }
          ].map(s => (
            <div key={s.sub} style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '12px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
            }}>
              {s.icon}
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{s.label}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>{s.sub}</span>
            </div>
          ))}
        </div>

        {/* Restaurant info expand */}
        <div
          onClick={() => setShowInfo(si => !si)}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 14px', borderRadius: 12,
            border: '1px solid var(--border-color)', cursor: 'pointer',
            backgroundColor: 'var(--bg-surface)', transition: 'background 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Info size={17} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Restaurant Info</span>
          </div>
          <ChevronDown
            size={16}
            color="var(--text-sub)"
            style={{ transform: showInfo ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
          />
        </div>

        {showInfo && (
          <div className="scale-in" style={{
            padding: '14px', marginTop: 8,
            borderRadius: 12, border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>Address</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{restaurant.address || 'New Delhi, India'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <Phone size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>Contact</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>+91 98765 43210</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <UtensilsCrossed size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>Cuisine</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{restaurant.cuisine}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ──── SEARCH + VEG FILTER ──── */}
      <div style={{
        padding: '14px 16px', background: 'var(--bg-container)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', gap: 10, alignItems: 'center'
      }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 12, padding: '10px 14px'
        }}>
          <Search size={16} color="var(--primary)" />
          <input
            type="text"
            placeholder="Search in menu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              border: 'none', background: 'none', outline: 'none',
              width: '100%', fontFamily: 'var(--font-family)',
              color: 'var(--text-main)', fontSize: '0.85rem'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-sub)', padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setVegOnly(v => !v)}
          style={{
            padding: '10px 14px', borderRadius: 12, flexShrink: 0,
            border: `1.5px solid ${vegOnly ? 'var(--success)' : 'var(--border-color)'}`,
            background: vegOnly ? 'var(--success-bg)' : 'var(--bg-card)',
            color: vegOnly ? 'var(--success)' : 'var(--text-main)',
            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', outline: 'none',
            display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
          }}
        >
          <DietIcon isVeg={true} size={13} />
          Veg Only
        </button>
      </div>

      {/* ──── STICKY CATEGORY NAV ──── */}
      {categories.length > 1 && !searchQuery && (
        <div ref={stickyRef} style={{
          position: 'sticky', top: 0, zIndex: 25,
          backgroundColor: 'var(--bg-container)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0 4px', overflowX: 'auto',
          display: 'flex', gap: 4,
          scrollbarWidth: 'none'
        }} className="no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              style={{
                padding: '11px 14px', flexShrink: 0,
                border: 'none',
                borderBottom: activeCategory === cat ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                background: 'none',
                color: activeCategory === cat ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeCategory === cat ? 800 : 500,
                fontSize: '0.82rem', cursor: 'pointer', outline: 'none',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ──── MENU SECTIONS ──── */}
      <div style={{ padding: '0 16px 120px' }}>
        {Object.keys(groupedMenu).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-sub)' }}>
            <p style={{ fontSize: '1.8rem', marginBottom: 10 }}>🍽️</p>
            <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>No items match your search</p>
            <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Try different keywords or remove filters</p>
          </div>
        ) : (
          Object.entries(groupedMenu).map(([cat, items]) => (
            <div
              key={cat}
              ref={el => { categoryRefs.current[cat] = el; }}
              style={{ paddingTop: 4 }}
            >
              {/* Category header */}
              <div style={{
                padding: '16px 0 4px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {cat}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                  {items.length} items
                </span>
              </div>

              {/* Items */}
              {items.map(item => (
                <FoodCard
                  key={item.id}
                  item={item}
                  qty={getQty(item.id)}
                  onAdd={() => handleAdd(item)}
                  onRemove={() => handleRemove(item)}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* ──── FLOATING CART SUMMARY ──── */}
      {getCartCount() > 0 && (
        <div style={{
          position: 'sticky', bottom: 78, margin: '0 12px',
          zIndex: 50
        }}>
          <div
            onClick={() => navigate('/cart')}
            className="scale-in"
            style={{
              backgroundColor: 'var(--primary)',
              borderRadius: 16, padding: '14px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              boxShadow: '0 8px 24px rgba(226,55,68,0.35)',
              cursor: 'pointer',
              animation: 'cartPulse 0.3s ease-out'
            }}
          >
            <div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 8, padding: '2px 10px',
                display: 'inline-block', marginBottom: 4
              }}>
                <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 700 }}>
                  {getCartCount()} {getCartCount() === 1 ? 'ITEM' : 'ITEMS'} added
                  {cartRestaurant?.name ? ` · ${cartRestaurant.name.split(' ')[0]}` : ''}
                </span>
              </div>
              <p style={{ color: 'white', fontSize: '1rem', fontWeight: 800 }}>
                ₹{getCartTotal()}
                <span style={{ fontSize: '0.72rem', fontWeight: 400, opacity: 0.8 }}> + taxes</span>
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 800 }}>
              <span style={{ fontSize: '0.9rem' }}>View Cart</span>
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>
      )}

      {/* ──── CART CONFLICT MODAL ──── */}
      {conflict && (
        <CartConflictModal
          conflict={conflict}
          onCancel={() => setConflict(null)}
          onForce={() => { conflict.forceAdd(); setConflict(null); }}
        />
      )}
    </div>
  );
};

export default RestaurantDetails;
