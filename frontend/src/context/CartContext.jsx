import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartRestaurant, setCartRestaurant] = useState(() => {
    const savedRes = localStorage.getItem('cartRestaurant');
    return savedRes ? JSON.parse(savedRes) : null;
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartRestaurant', JSON.stringify(cartRestaurant));
  }, [cartItems, cartRestaurant]);

  const addToCart = (item, restaurant) => {
    // If the cart has items from a different restaurant, show a custom conflict return
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
      return {
        conflict: true,
        message: `Your cart contains items from ${cartRestaurant.name || 'another restaurant'}. Would you like to clear the cart and add items from ${restaurant.name || 'this restaurant'} instead?`,
        // Function to force clear and add new item
        forceAdd: () => {
          setCartRestaurant(restaurant);
          setCartItems([{ ...item, quantity: 1 }]);
          return { success: true };
        }
      };
    }

    // Set restaurant if first item
    if (!cartRestaurant) {
      setCartRestaurant(restaurant);
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });

    return { success: true };
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems
        .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);

      // If cart becomes empty, reset restaurant
      if (updatedItems.length === 0) {
        setCartRestaurant(null);
      }
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartRestaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
