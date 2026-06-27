import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Search from './pages/Search';
import Orders from './pages/Orders';
import BottomNavigation from './components/Layout/BottomNavigation';
import SplashScreen from './components/Common/SplashScreen';

// App Inner wrapper to conditionally show navigation and style wrapper
const AppContentWrapper = () => {
  const location = useLocation();
  const path = location.pathname;

  const [showSplash, setShowSplash] = useState(() => {
    // Show splash only if it hasn't been shown in the current tab session
    const hasShown = sessionStorage.getItem('hasShownSplash');
    return hasShown !== 'true';
  });

  const handleSplashFinished = () => {
    sessionStorage.setItem('hasShownSplash', 'true');
    setShowSplash(false);
  };

  // Hide bottom tab bar on auth, checkout, and tracking screens for full-screen focus
  const hideNavBar = path.startsWith('/login') || path.startsWith('/track') || path.startsWith('/checkout');

  return (
    <div className="desktop-wrapper">
      <div className="app-container">
        {showSplash && <SplashScreen onFinished={handleSplashFinished} />}
        <div className="app-content" style={{ paddingBottom: hideNavBar ? '0' : '74px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track/:orderId" element={<TrackOrder />} />
            <Route path="/search" element={<Search />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
        {!hideNavBar && <BottomNavigation />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContentWrapper />
    </Router>
  );
};

export default App;
