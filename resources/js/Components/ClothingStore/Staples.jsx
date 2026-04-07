import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus } from 'lucide-react';

import { useCart } from '@/contexts/CartContext';
import { formatNpr, normalizeStorefrontProduct } from '@/utils/storefront';

const Staples = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchShowcaseProducts = async () => {
      try {
        const response = await axios.get(route('ourproducts.showcase.sale'));
        const items = (response.data.data || []).map(normalizeStorefrontProduct);
        setProducts(items);
      } catch (error) {
        console.error('Error fetching sale showcase:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcaseProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      productId: product.id,
      title: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.image,
      sellerId: product.seller_id || 1,
      sellerName: product.seller_name || 'Roon Apparel',
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Default',
      slug: product.slug || product.id,
    });
  };

  return (
    <section className="py-8 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="text-center mb-8 md:mb-14">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-gray-900">
          Timeless Staples
        </h2>
        <p className="mt-3 text-sm md:text-base text-gray-500">Live sale products from the backend</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="md:col-span-2">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse h-72 md:h-[75vh]" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:hidden">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isMobile />
                ))}
              </div>

              <div className="hidden md:grid grid-cols-2 gap-3 md:gap-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </>
          )}
        </div>

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

const ProductCard = ({ product, onAddToCart, isMobile = false }) => (
  <div className="group relative overflow-hidden bg-white transition-all duration-300 hover:shadow-lg flex flex-col">
    <a href={`/detailsproduct/${product.slug}`} className="block">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {product.on_sale && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col items-end gap-2">
            <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-white text-gray-800 border border-gray-200">
              SALE
            </span>
            {product.discount_percent > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-red-600 text-white">
                {product.discount_percent}% OFF
              </span>
            )}
          </div>
        )}
      </div>
    </a>

    {/* <div className="p-2 md:p-4 flex-1 flex flex-col">
      <a href={`/detailsproduct/${product.slug}`} className="block hover:text-gray-700">
        <h3 className="text-gray-900 font-medium mb-1 text-sm md:text-lg line-clamp-1">{product.name}</h3>
      </a>
      <div className="mb-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">
          {product.sale_category || product.category}
        </span>
      </div>
      <div className="flex items-center justify-between mb-2 md:mb-3 gap-3">
        <p className="text-gray-700 font-medium text-sm md:text-base">{formatNpr(product.price)}</p>
        {product.on_sale && (
          <span className="text-xs md:text-sm text-gray-500 line-through">{formatNpr(product.original_price)}</span>
        )}
      </div>
      {product.on_sale && (
        <p className="mb-3 text-xs md:text-sm text-red-600 font-medium">
          Save {formatNpr(product.discount_amount)}
        </p>
      )}

      {isMobile ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
          className="w-full bg-gray-900 text-white py-2 px-2 text-xs font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-1"
        >
          <ShoppingCart className="w-3 h-3" />
          <span>Add</span>
        </button>
      ) : (
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
          </button>
        </div>
      )}
    </div> */}
  </div>
);

export default Staples;
