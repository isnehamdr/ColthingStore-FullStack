// contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCart([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product) => {
    if (!product || !product.productId) {
      console.error('Invalid product:', product);
      toast.error('Failed to add product to cart');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.productId);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { 
          ...product, 
          quantity: 1,
          price: product.price || 0,
          sellerId: product.sellerId || 'unknown',
          sellerName: product.sellerName || 'Seller'
        }];
      }
    });

  };

  const removeFromCart = (productId, productName = 'Product') => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    
   
  };

  const updateQuantity = (productId, quantity, productName = 'Product') => {
    if (quantity < 1) {
      removeFromCart(productId, productName);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );

   
  };

  const clearCart = () => {
    if (cart.length > 0) {
      setCart([]);
      toast.success('Cart cleared successfully!', {
        icon: '🛒',
        duration: 3000,
        style: {
          background: '#F59E0B',
          color: 'white',
        }
      });
    }
  };

  const getCartItemsMap = () => {
    return cart.reduce((acc, item) => {
      acc[item.productId] = item;
      return acc;
    }, {});
  };

  // Calculate cart totals with safe defaults
  const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const shippingTotal = cart.reduce((sum, item) => sum + (item.shippingFee || 0), 0);
  const grandTotal = subtotal + shippingTotal;

  // Group cart items by seller with safe defaults
  const groupedCart = cart.reduce((acc, item) => {
    const sellerId = item.sellerId || 'unknown';
    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerId: sellerId,
        sellerName: item.sellerName || 'Seller',
        items: [],
      };
    }
    acc[sellerId].items.push(item);
    return acc;
  }, {});

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsMap,
    cartCount: cart.reduce((total, item) => total + (item.quantity || 1), 0),
    subtotal,
    grandTotal,
    groupedCart,
    isLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};