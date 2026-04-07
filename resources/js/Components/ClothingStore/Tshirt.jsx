import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, X, Filter, ChevronDown, ChevronUp, Star, StarHalf, Heart, Share2, Truck, Shield, RotateCcw, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from '@inertiajs/react';
import { formatNpr } from '@/utils/storefront';
const imagepath= import.meta.env.VITE_IMAGE_PATH
const Shirt = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'

  // Sidebar filter states
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Use CartContext
  const { addToCart, cart } = useCart();
  


  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(route('ourproducts.index'));

      if (response.data.success) {
        // Filter products to only include shirts
        const shirtProducts = response.data.data.filter(product => 
          product.category && product.category.toLowerCase().includes('shirt')
        );
        
        // Normalize product data with multiple images
        const normalizedProducts = shirtProducts.map(product => ({
          ...product,
          name: product.product_name,
          label: product.product_name,
          // Use multiple images if available, otherwise create placeholder array
          images: product.images && product.images.length > 0 
            ? product.images 
            : [
                { image_path: '/images/placeholder-shirt-1.jpg' },
                { image_path: '/images/placeholder-shirt-2.jpg' },
                { image_path: '/images/placeholder-shirt-3.jpg' }
              ],
          rating: product.rating || 4.0,
          reviews_count: product.reviews_count || 0,
          original_price: parseFloat(product.price),
          price: product.discount_price ? parseFloat(product.discount_price) : parseFloat(product.price),
          on_sale: !!product.discount_price,
          is_new: product.is_new || false,
          sizes: typeof product.size === 'string' ? product.size.split(',').map(s => s.trim()) : product.size || ['M'],
          colors: typeof product.color === 'string' ? product.color.split(',').map(c => c.trim()) : product.color || ['White'],
          description: product.description || 'Crafted with premium materials and attention to detail, this shirt embodies timeless elegance. Perfect for any occasion, it combines comfort with sophisticated style.',
          features: product.features || [
            'Premium cotton fabric',
            'Regular fit',
            'Machine washable',
            'Wrinkle-resistant'
          ],
          care_instructions: product.care_instructions || [
            'Machine wash cold',
            'Tumble dry low',
            'Iron on low heat',
            'Do not bleach'
          ]
        }));

        setProducts(normalizedProducts);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleAddToCart = (product, selectedSize = null, selectedColor = null) => {
    const cartProduct = {
      productId: product.id,
      title: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: `${imagepath}/${product.images[0].image_path}`,
      sellerId: product.seller_id || 1,
      sellerName: product.seller_name || 'Roon Apparel',
      size: selectedSize || (product.sizes && product.sizes[0]) || 'M',
      color: selectedColor || (product.colors && product.colors[0]) || 'White',
      slug: product.slug || product.id
    };

    addToCart(cartProduct);
    
    toast.success(`${product.name} added to cart!`, {
      duration: 3000,
      position: 'bottom-right',
      icon: '🛒',
      style: {
        background: '#000000',
        color: 'white',
        fontWeight: '500',
      },
    });
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const applySidebarFilters = (products) => {
    return products.filter(product => {
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      if (selectedColors.length > 0) {
        const productColors = product.colors || [];
        const hasMatchingColor = selectedColors.some(color => 
          productColors.some(pc => pc.toLowerCase().includes(color.toLowerCase()))
        );
        if (!hasMatchingColor) return false;
      }
      
      if (selectedSizes.length > 0) {
        const productSizes = product.sizes || [];
        const hasMatchingSize = selectedSizes.some(size => 
          productSizes.some(ps => ps.toLowerCase().includes(size.toLowerCase()))
        );
        if (!hasMatchingSize) return false;
      }
      
      return true;
    });
  };

  const filteredProducts = activeFilter === 'all' 
    ? applySidebarFilters(products) 
    : applySidebarFilters(products.filter(product => {
        const productType = product.type || product.category || '';
        return productType.toLowerCase().includes(activeFilter.toLowerCase());
      }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600 text-sm tracking-wide">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">{error}</p>
          <button 
            onClick={fetchProducts} 
            className="px-6 py-2 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Toaster Container */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#000000',
            color: '#ffffff',
            border: '1px solid #333',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#ffffff',
              secondary: '#000000',
            },
          },
        }}
      />

      {/* Mobile filter button */}
      <button 
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-neutral-900 text-white p-4 rounded-full shadow-lg hover:bg-neutral-800 transition-all"
        onClick={() => setSidebarOpen(true)}
      >
        <Filter className="w-5 h-5" />
      </button>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
        />

        {/* Main Content */}
        <div className="flex-1 ">
           {/* Hero Section */}
          <div className="relative w-full h-[50vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0">
              <img
                src="/images/images.jpeg"
                alt="Premium Pants Collection"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/20 to-transparent"></div>
            </div>

            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className="max-w-2xl space-y-6">
                <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                  Premium
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                    Shirt Collection
                  </span>
                </h1>
              </div>
            </div>
          </div>
          {/* Header Section */}
          <div className="pt-20 pb-12 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 mb-3">
                Shirts Collection
              </h1>
              <p className="text-neutral-600 text-sm tracking-wide">
                Discover timeless pieces crafted with precision
              </p>
            </div>
          </div>
          

          {/* Filter Pills and View Toggle */}
          {/* <div className="px-6 lg:px-12 pb-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Shirts' },
                  { id: 'casual', label: 'Casual' },
                  { id: 'formal', label: 'Formal' },
                  { id: 'dress', label: 'Dress' },
                  { id: 'slim', label: 'Slim Fit' }
                ].map((filter) => (
                  <button 
                    key={filter.id}
                    className={`px-5 py-2 text-sm tracking-wide transition-all ${
                      activeFilter === filter.id 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              {/* View Toggle */}
              {/* <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('detail')}
                  className={`p-2 ${viewMode === 'detail' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'}`}
                >
                  Detail
                </button>
              </div>
            </div>
          </div> */} 

          {/* Product Grid */}
          <div className="px-6 lg:px-12 pb-20">
            <div className="max-w-7xl mx-auto">
              {filteredProducts.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id}
                        product={product}
                        onSelect={handleProductSelect}
                        onAddToCart={handleAddToCart}
                        renderRating={renderRating}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {filteredProducts.map((product) => (
                      <ProductDetailCard 
                        key={product.id}
                        product={product}
                        onSelect={handleProductSelect}
                        onAddToCart={handleAddToCart}
                        renderRating={renderRating}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-20">
                  <p className="text-neutral-600 mb-4">No products match your filters</p>
                  <button 
                    onClick={() => {
                      setPriceRange([0, 500]);
                      setSelectedColors([]);
                      setSelectedSizes([]);
                    }}
                    className="px-6 py-2 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct}
          onClose={() => setShowDetails(false)}
          onAddToCart={handleAddToCart}
          renderRating={renderRating}
        />
      )}
    </div>
  );
};

// Product Card Component (Grid View)
const ProductCard = ({ product, onSelect, onAddToCart, renderRating }) => {



  console.log(product);
  return (
    <div className="group cursor-pointer" onClick={() => onSelect(product)}>
      {/* Image Container */}
      <Link 
  href={`/detailsproduct/${product.slug}`}
  className="px-4 bg-white text-neutral-900 py-3 text-sm tracking-wide hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 border border-neutral-200"
  onClick={(e) => e.stopPropagation()}
>


      <div className="relative bg-white overflow-hidden">
        <img 
          className="w-full h-[50vh] object-cover transition-transform duration-500 group-hover:scale-105"
          // src={product.images && product.images[0] ? `/storage/${product.images[0].image_path}` : '/images/placeholder-shirt.jpg'}
src={`${imagepath}/${product.images[0].image_path}`}

          alt={product.name}
         
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2"> 
          {product.is_new && (
            <span className="bg-neutral-900 text-white text-xs px-3 py-1 tracking-wider">NEW</span>
          )}
          {product.on_sale && (
            <span className="bg-white text-neutral-900 text-xs px-3 py-1 tracking-wider font-medium">SALE</span>
          )}
        </div>

        {/* Quick Add Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
        >
          Add to Cart
        </button>
          
      </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2 text-center mt-4">
        <a 
          href={`/view/${product.slug || product.id}`}
          className="text-sm tracking-wide text-neutral-900 font-medium hover:text-neutral-600 transition-colors block"
        >
          {product.name}
        </a>

        {/* Rating */}
        <div className="flex items-center gap-2 justify-center">
          <div className="flex">
            {renderRating(product.rating)}
          </div>
          <span className="text-xs text-neutral-500">({product.reviews_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 justify-center">
          <span className="text-neutral-900 font-medium">
            {formatNpr(product.price)}
          </span>
          {product.on_sale && (
            <>
              <span className="text-sm text-neutral-400 line-through">
                {formatNpr(product.original_price)}
              </span>
              <span className="text-xs text-red-600 font-medium">
                {Math.round((1 - product.price / product.original_price) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Available Colors */}
        <div className="flex gap-1 justify-center">
          {product.colors && product.colors.slice(0, 4).map((color, idx) => (
            <div 
              key={idx}
              className="w-4 h-4 rounded-full border border-neutral-300"
              style={{ 
                backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                               color.toLowerCase() === 'beige' ? '#F5F5DC' :
                               color.toLowerCase() === 'navy' ? '#000080' :
                               color.toLowerCase()
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Detail Card Component (Detail View)
const ProductDetailCard = ({ product, onSelect, onAddToCart, renderRating }) => {
  return (
    <div className="bg-white border border-neutral-200">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
            <img 
src={`${imagepath}/${product.images[0].image_path}`}        
      alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {product.images && product.images.slice(0, 4).map((image, index) => (
              <div key={index} className="aspect-square bg-neutral-100 overflow-hidden">
                <img 
src={`${imagepath}/${image.image_path}`}
                  alt={`${product.images[index].name} `}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-light tracking-tight text-neutral-900 mb-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {renderRating(product.rating)}
              </div>
              <span className="text-sm text-neutral-500">
                ({product.reviews_count} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-light text-neutral-900">
              {formatNpr(product.price)}
            </span>
            {product.on_sale && (
              <>
                <span className="text-lg text-neutral-400 line-through">
                  {formatNpr(product.original_price)}
                </span>
                <span className="text-sm text-red-600 font-medium">
                  {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-900">Features:</h4>
            <ul className="text-sm text-neutral-600 space-y-1">
              {product.features && product.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-neutral-900 text-white py-3 text-sm tracking-wide hover:bg-neutral-800 transition-colors"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => onSelect(product)}
              className="px-6 py-3 border border-neutral-900 text-neutral-900 text-sm tracking-wide hover:bg-neutral-50 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Product Details Modal with Multiple Images
const ProductDetailsModal = ({ product, onClose, onAddToCart, renderRating }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors[0] || 'White');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedSize, selectedColor);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex justify-between items-center z-10">
          <h2 className="text-lg font-medium">Product Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
              <img 
src={`${imagepath}/${product.images.image_path}`}       
         alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                  >
                    <ChevronDown className="w-5 h-5 rotate-90" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                  >
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 text-sm rounded-full">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-neutral-100 overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-neutral-900' : 'border-transparent'
                    }`}
                  >
                    <img 
src={`${imagepath}/${product.images[0].image_path}`}         
             alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderRating(product.rating)}
                </div>
                <span className="text-sm text-neutral-500">
                  ({product.reviews_count} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-light text-neutral-900">
                {formatNpr(product.price)}
              </span>
              {product.on_sale && (
                <>
                  <span className="text-xl text-neutral-400 line-through">
                    {formatNpr(product.original_price)}
                  </span>
                  <span className="text-sm text-red-600 font-medium">
                    {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-900">Key Features:</h4>
              <ul className="text-sm text-neutral-600 space-y-2">
                {product.features && product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-neutral-900 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="text-sm tracking-wide text-neutral-900 font-medium">
                SIZE
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map(size => (
                    <button 
                      key={size}
                      className={`w-12 h-12 text-sm tracking-wide transition-all ${
                        selectedSize === size 
                          ? 'bg-neutral-900 text-white' 
                          : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-900'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <span className="text-neutral-500 text-sm">No sizes available</span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm tracking-wide text-neutral-900 font-medium">
                COLOR
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map(color => (
                    <button 
                      key={color}
                      className={`px-4 py-2 text-sm tracking-wide transition-all ${
                        selectedColor === color 
                          ? 'bg-neutral-900 text-white' 
                          : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-900'
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))
                ) : (
                  <span className="text-neutral-500 text-sm">No colors available</span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm tracking-wide text-neutral-900 font-medium">
                QUANTITY
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-300">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-neutral-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-neutral-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-neutral-500">
                  {quantity} item{quantity !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-neutral-900 text-white py-4 text-sm tracking-wide hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart ({quantity})
              </button>
   


            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Truck className="w-4 h-4" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Shield className="w-4 h-4" />
                <span>2-year warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <RotateCcw className="w-4 h-4" />
                <span>30-day returns</span>
              </div>
            </div>

            {/* Care Instructions */}
            {product.care_instructions && (
              <div className="pt-6 border-t border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Care Instructions:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  {product.care_instructions.map((instruction, index) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component (unchanged - keep the existing Sidebar component)
const Sidebar = ({ 
  isOpen, 
  onClose, 
  priceRange, 
  setPriceRange, 
  selectedColors, 
  setSelectedColors, 
  selectedSizes, 
  setSelectedSizes 
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    color: true,
    size: true
  });

  const categories = [
    { name: 'All products', path: '/home' },
    { name: 'Jackets', path: '/jacket' },
    { name: 'Jeans', path: '/jacket' },
    { name: 'Shirts', path: '/shirt' },
    { name: 'Pants', path: '/pant' },
    { name: 'All Clothes', path: '/allproduct' }
  ];

  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen w-80 bg-white z-50 lg:z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto border-r border-neutral-200
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 bg-white border-b border-neutral-200 p-6 flex justify-between items-center">
          <h2 className="text-lg tracking-wide font-medium">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Categories */}
          <div>
            <button 
              className="w-full flex justify-between items-center mb-4"
              onClick={() => toggleSection('categories')}
            >
              <h3 className="text-sm tracking-wider font-medium text-neutral-900">CATEGORIES</h3>
              {openSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.categories && (
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.name}>
                    <a 
                      href={cat.path}
                      className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price */}
          <div>
            <button 
              className="w-full flex justify-between items-center mb-4"
              onClick={() => toggleSection('price')}
            >
              <h3 className="text-sm tracking-wider font-medium text-neutral-900">PRICE</h3>
              {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.price && (
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-neutral-900"
                />
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>{formatNpr(priceRange[0])}</span>
                  <span>{formatNpr(priceRange[1])}</span>
                </div>
              </div>
            )}
          </div>

          {/* Color */}
          <div>
            <button 
              className="w-full flex justify-between items-center mb-4"
              onClick={() => toggleSection('color')}
            >
              <h3 className="text-sm tracking-wider font-medium text-neutral-900">COLOR</h3>
              {openSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.color && (
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button 
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColors.includes(color) 
                        ? 'border-neutral-900 scale-110' 
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                    style={{ 
                      backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase()
                    }}
                    onClick={() => handleColorToggle(color)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Size */}
          <div>
            <button 
              className="w-full flex justify-between items-center mb-4"
              onClick={() => toggleSection('size')}
            >
              <h3 className="text-sm tracking-wider font-medium text-neutral-900">SIZE</h3>
              {openSections.size ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.size && (
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button 
                    key={size}
                    className={`w-12 h-12 text-sm transition-all ${
                      selectedSizes.includes(size) 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-900'
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          <button 
            onClick={() => {
              setPriceRange([0, 500]);
              setSelectedColors([]);
              setSelectedSizes([]);
            }}
            className="w-full py-3 text-sm tracking-wide text-neutral-600 border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default Shirt;
