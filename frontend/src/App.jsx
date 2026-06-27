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
import ProtectedRoute from './components/Common/ProtectedRoute';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Overview from './pages/Dashboard/Overview';
import OrdersManager from './pages/Dashboard/OrdersManager';
import MenuManager from './pages/Dashboard/MenuManager';
import ProfileManager from './pages/Dashboard/ProfileManager';
import Reviews from './pages/Dashboard/Reviews';

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

  // Hide bottom tab bar on auth, checkout, tracking, and dashboard screens
  const hideNavBar = path.startsWith('/login') || path.startsWith('/track') || path.startsWith('/checkout') || path.startsWith('/dashboard');

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

            {/* Restaurant Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['restaurant']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="profile" element={<ProfileManager />} />
              <Route path="reviews" element={<Reviews />} />
            </Route>
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
