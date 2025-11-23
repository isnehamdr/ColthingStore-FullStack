import React, { useState } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';

const Staples = () => {
  const [cartItems, setCartItems] = useState({});

  const handleAddToCart = (product) => {
    setCartItems(prev => ({
      ...prev,
      [product.id]: {
        quantity: (prev[product.id]?.quantity || 0) + 1
      }
    }));
  };

  const products = [
    {
      id: 1,
      slug: "washed-blue-denim-jacket",
      name: "Washed Blue Denim Jacket",
      price: 99.00,
      originalPrice: 129.00,
      image: "/images/t1.avif",
      images: [
        "/images/t1.avif",
        "/images/c1.avif",
        "/images/c2.avif",
        "/images/c3.avif"
      ],
      sale: true,
      description: "Classic denim jacket with a comfortable washed finish. Perfect for layering over any outfit.",
      rating: 4.5,
      reviews_count: 28,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Light Blue', 'Medium Blue', 'Dark Blue']
    },
    {
      id: 2,
      slug: "classic-white-t-shirt",
      name: "Classic White T-Shirt",
      price: 49.00,
      originalPrice: 69.00,
      image: "/images/t2.avif",
      images: [
        "/images/t2.avif",
        "/images/t2.avif",
        "/images/c2.avif",
        "/images/c3.avif"
      ],
      sale: true,
      description: "Essential white t-shirt made from premium cotton. The perfect foundation for any wardrobe.",
      rating: 4.8,
      reviews_count: 42,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Off-White', 'Cream']
    },
    {
      id: 3,
      slug: "slim-black-trousers",
      name: "Slim Black Trousers",
      price: 89.00,
      originalPrice: 119.00,
      image: "/images/t3.avif",
      images: [
        "/images/t3.avif",
        "/images/t3.avif",
        "/images/c2.avif",
        "/images/c4.avif"
      ],
      sale: true,
      description: "Elegant slim-fit trousers in classic black. Ideal for both formal and casual occasions.",
      rating: 4.3,
      reviews_count: 31,
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Black', 'Charcoal', 'Navy']
    },
    {
      id: 4,
      slug: "knit-beanie-hat",
      name: "Knit Beanie Hat",
      price: 29.00,
      originalPrice: 39.00,
      image: "/images/t4.avif",
      images: [
        "/images/t4.avif",
        "/images/t4.avif",
        "/images/c1.avif",
        "/images/c2.avif"
      ],
      sale: true,
      description: "Soft knit beanie for cooler days. Comfortable, stylish, and versatile.",
      rating: 4.6,
      reviews_count: 19,
      sizes: ['One Size'],
      colors: ['Black', 'Gray', 'Navy', 'Cream']
    },
    {
      id: 5,
      slug: "wool-blend-coat",
      name: "Wool Blend Coat",
      price: 199.00,
      originalPrice: 259.00,
      image: "/images/t1.avif",
      images: [
        "/images/t1.avif",
        "/images/c1.avif",
        "/images/c2.avif",
        "/images/c3.avif"
      ],
      sale: true,
      description: "Premium wool blend coat for sophisticated winter styling.",
      rating: 4.7,
      reviews_count: 35,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Camel', 'Black', 'Navy']
    },
    {
      id: 6,
      slug: "cashmere-scarf",
      name: "Cashmere Scarf",
      price: 79.00,
      originalPrice: 99.00,
      image: "/images/t1.avif",
      images: [
        "/images/t1.avif",
        "/images/c1.avif",
        "/images/c2.avif",
        "/images/c3.avif"
      ],
      sale: true,
      description: "Luxurious cashmere scarf for ultimate warmth and comfort.",
      rating: 4.9,
      reviews_count: 27,
      sizes: ['One Size'],
      colors: ['Charcoal', 'Cream', 'Burgundy']
    }
  ];

  return (
    <section className="py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Section Header */}
      <div className="text-center mb-8 md:mb-14">
        <h2 className='text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-gray-900'>
          Timeless Staples
        </h2>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Left Column - Product Grid */}
        <div className="md:col-span-2">
          {/* Mobile Grid - Show all products */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:hidden">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                cartItems={cartItems} 
                onAddToCart={handleAddToCart} 
                isMobile={true}
              />
            ))}
          </div>
          
          {/* Desktop Grid - Show only first 4 products */}
          <div className="hidden md:grid grid-cols-2 gap-3 md:gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                cartItems={cartItems} 
                onAddToCart={handleAddToCart} 
                isMobile={false}
              />
            ))}
          </div>
        </div>
        
        {/* Right Column - Featured Banner */}
        <div className="group relative overflow-hidden mt-4 md:mt-0">
          <img 
            src="/images/t5.avif" 
            alt="Latest Classic Arrivals"
            className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white p-4 md:p-6">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-light mb-1 md:mb-2">Shop our Latest</h2>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium mb-3 md:mb-6">Classic Arrivals</h2>
              <a href="/allproduct">
                <button className="bg-white text-gray-900 py-2 md:py-3 px-4 md:px-8 text-sm md:text-base rounded-full font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  Shop Now
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Separate Product Card Component for better organization
const ProductCard = ({ product, cartItems, onAddToCart, isMobile }) => {
  return (
    <div className="group relative overflow-hidden bg-white transition-all duration-300 hover:shadow-lg flex flex-col">
      <a href={`/detailpage/${product.slug}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 sm:h-64 md:h-80 lg:h-[75vh] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.sale && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4">
              <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-white text-gray-800 border border-gray-200">
                SALE
              </span>
            </div>
          )}
        </div>
      </a>
      
      <div className="p-2 md:p-4 flex-1 flex flex-col">
        <a href={`/detailpage/${product.slug}`} className="block hover:text-gray-700">
          <h3 className='text-gray-900 font-medium mb-1 text-sm md:text-lg line-clamp-1'>{product.name}</h3>
        </a>
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <p className='text-gray-700 font-medium text-sm md:text-base'>${product.price.toFixed(2)}</p>
          <span className="text-xs md:text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
        </div>
        
        {/* Mobile Button - Always visible on small screens */}
        {isMobile && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="w-full bg-gray-900 text-white py-2 px-2 text-xs font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Add</span>
            {cartItems[product.id]?.quantity > 0 && (
              <span className="bg-white text-gray-900 rounded-full w-4 h-4 text-xs flex items-center justify-center ml-1">
                {cartItems[product.id].quantity}
              </span>
            )}
          </button>
        )}

        {/* Desktop Button - Hidden on mobile, shows on hover on desktop */}
        {!isMobile && (
          <div className="h-12 overflow-hidden">
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="w-full bg-gray-900 text-white py-3 px-4 font-medium hover:bg-gray-800 transition-all duration-300 transform translate-y-full group-hover:translate-y-0 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add to Cart</span>
              {cartItems[product.id]?.quantity > 0 && (
                <span className="bg-white text-gray-900 rounded-full w-5 h-5 text-xs flex items-center justify-center ml-1">
                  {cartItems[product.id].quantity}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staples;