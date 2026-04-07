import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { 
  ShoppingCart, X, Filter, ChevronDown, ChevronUp, 
  Star, StarHalf, Heart, Share2, Truck, Shield, 
  RotateCcw, ChevronLeft, ChevronRight, Eye, 
  Grid, List, Loader 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from '@inertiajs/react';
import { formatNpr } from '@/utils/storefront';

const imagepath = import.meta.env.VITE_IMAGE_PATH;

const Pant = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Sidebar filter states
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(route('ourproducts.index'));

      if (response.data.success) {
        const pantProducts = response.data.data.filter(product => 
          product.category?.toLowerCase().includes('pant')
        );
        
        const normalizedProducts = pantProducts.map(product => ({
          ...product,
          name: product.product_name,
          label: product.product_name,
          images: product.images?.length > 0 
            ? product.images 
            : [
                { image_path: '/images/placeholder-pant-1.jpg' },
                { image_path: '/images/placeholder-pant-2.jpg' },
                { image_path: '/images/placeholder-pant-3.jpg' }
              ],
          rating: product.rating || 4.0,
          reviews_count: product.reviews_count || 0,
          original_price: parseFloat(product.price),
          price: product.discount_price ? parseFloat(product.discount_price) : parseFloat(product.price),
          on_sale: !!product.discount_price,
          is_new: product.is_new || false,
          sizes: typeof product.size === 'string' ? product.size.split(',').map(s => s.trim()) : product.size || ['M'],
          colors: typeof product.color === 'string' ? product.color.split(',').map(c => c.trim()) : product.color || ['Black'],
          seller_id: product.seller_id || 1,
          seller_name: product.seller_name || 'Roon Apparel',
          description: product.description || 'Crafted with premium materials and attention to detail, these pants embody timeless elegance. Perfect for any occasion, they combine comfort with sophisticated style.',
          features: product.features || [
            'Premium fabric blend',
            'Comfortable fit',
            'Machine washable',
            'Wrinkle-resistant'
          ],
          care_instructions: product.care_instructions || [
            'Machine wash cold',
            'Tumble dry low',
            'Iron on medium heat',
            'Do not bleach'
          ],
          material: product.material || 'Cotton Blend',
          fit: product.fit || 'Regular Fit'
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
      image: `${imagepath}/${product.images[0]?.image_path || '/images/placeholder-pant-1.jpg'}`,
      sellerId: product.seller_id || 1,
      sellerName: product.seller_name || 'Roon Apparel',
      size: selectedSize || (product.sizes && product.sizes[0]) || 'M',
      color: selectedColor || (product.colors && product.colors[0]) || 'Black',
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
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // Color filter
      if (selectedColors.length > 0) {
        const productColors = product.colors || [];
        const hasMatchingColor = selectedColors.some(color => 
          productColors.some(pc => pc.toLowerCase().includes(color.toLowerCase()))
        );
        if (!hasMatchingColor) return false;
      }
      
      // Size filter
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
          <Loader className="w-8 h-8 animate-spin mx-auto text-neutral-900" />
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
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#000000',
            color: '#ffffff',
            border: '1px solid #333',
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
        <div className="flex-1">
          {/* Hero Section */}
          <div className="relative w-full h-[50vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0">
              <img
                src="images/img2.jpeg"
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
                    Pants Collection
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="pt-12 pb-8 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-neutral-900 mb-2">
                    Pants Collection
                  </h1>
                  <p className="text-neutral-600 text-sm tracking-wide">
                    {filteredProducts.length} products found
                  </p>
                </div>

                {/* View Toggle */}
                {/* <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('detail')}
                    className={`p-2 transition-all ${
                      viewMode === 'detail' 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-6 lg:px-12 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Pants' },
                  { id: 'casual', label: 'Casual' },
                  { id: 'formal', label: 'Formal' },
                  { id: 'dress', label: 'Dress' },
                  { id: 'slim', label: 'Slim Fit' }
                ].map((filter) => (
                  <button 
                    key={filter.id}
                    className={`px-4 py-2 text-sm tracking-wide transition-all rounded-full ${
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
            </div>
          </div>

          {/* Product Grid */}
          <div className="px-6 lg:px-12 pb-20">
            <div className="max-w-7xl mx-auto">
              {filteredProducts.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <div className="grid grid-cols-1 gap-6">
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
        <EnhancedProductDetailsModal 
          product={selectedProduct}
          onClose={() => setShowDetails(false)}
          onAddToCart={handleAddToCart}
          renderRating={renderRating}
        />
      )}
    </div>
  );
};

// Enhanced Product Card Component
const ProductCard = ({ product, onSelect, onAddToCart, renderRating }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const mainImage = product.images?.[currentImageIndex] || { image_path: '/images/placeholder-pant-1.jpg' };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link 
          href={`/detailsproduct/${product.slug}`}
          className="block w-full h-full"
        >
          <img 
            src={`${imagepath}/${mainImage.image_path}`}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-neutral-100 animate-pulse"></div>
          )}
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-neutral-900 text-white text-xs px-2 py-1 tracking-wider rounded">NEW</span>
          )}
          {product.on_sale && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 tracking-wider rounded">SALE</span>
          )}
        </div>

        {/* Image Navigation */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
          className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 text-sm tracking-wide rounded opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
        >
          Quick Add
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <Link 
          href={`/detailsproduct/${product.slug}`}
          className="block group"
        >
          <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 group-hover:text-neutral-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {renderRating(product.rating)}
          </div>
          <span className="text-xs text-neutral-500">({product.reviews_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-neutral-900">
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
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color, idx) => (
              <div 
                key={idx}
                className="w-4 h-4 rounded-full border border-neutral-300"
                style={{ 
                  backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                 color.toLowerCase() === 'beige' ? '#F5F5DC' :
                                 color.toLowerCase() === 'navy' ? '#000080' :
                                 color.toLowerCase()
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="w-4 h-4 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center">
                <span className="text-xs text-neutral-600">+{product.colors.length - 4}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Product Detail Card Component
const ProductDetailCard = ({ product, onSelect, onAddToCart, renderRating }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-6">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden">
            <img 
              src={`${imagepath}/${product.images?.[0]?.image_path || '/images/placeholder-pant-1.jpg'}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={index} className="aspect-square bg-neutral-100 rounded overflow-hidden border-2 border-transparent hover:border-neutral-900 transition-colors">
                  <img 
                    src={`${imagepath}/${image.image_path}`}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-light text-neutral-900 mb-2">
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

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-neutral-900">Material:</span>
              <span className="text-neutral-600 ml-2">{product.material}</span>
            </div>
            <div>
              <span className="font-medium text-neutral-900">Fit:</span>
              <span className="text-neutral-600 ml-2">{product.fit}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-neutral-900 text-white py-3 text-sm font-medium hover:bg-neutral-800 transition-colors rounded flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button 
              onClick={() => onSelect(product)}
              className="px-6 py-3 border border-neutral-900 text-neutral-900 text-sm font-medium hover:bg-neutral-50 transition-colors rounded"
            >
              Quick View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Product Details Modal (keep the existing modal implementation, just fix image paths)
const EnhancedProductDetailsModal = ({ product, onClose, onAddToCart, renderRating }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Black');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

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
      <div className="bg-white max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
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
            <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden group">
              <img 
                src={`${imagepath}/${product.images?.[selectedImage]?.image_path || '/images/placeholder-pant-1.jpg'}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
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
                    className={`aspect-square bg-neutral-100 rounded overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-neutral-900' : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img 
                      src={`${imagepath}/${image.image_path}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Keep existing modal details implementation */}
          {/* ... rest of the modal implementation ... */}
        </div>
      </div>
    </div>
  );
};

// Sidebar Component (unchanged, but you can enhance it similarly)
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
    { name: 'Jeans', path: '/jeans' },
    { name: 'Pants', path: '/pant' },
    { name: 'Shirts', path: '/shirt' },
    { name: 'All Clothes', path: '/allproduct' }
  ];

  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Beige', 'Navy'];
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
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen w-80 bg-white z-50 lg:z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto border-r border-neutral-200
      `}>
        <div className="lg:hidden sticky top-0 bg-white border-b border-neutral-200 p-6 flex justify-between items-center">
          <h2 className="text-lg font-medium">Filters</h2>
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
              <h3 className="text-sm font-medium text-neutral-900">CATEGORIES</h3>
              {openSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.categories && (
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.name}>
                    <a 
                      href={cat.path}
                      className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors block py-1"
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
              <h3 className="text-sm font-medium text-neutral-900">PRICE</h3>
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
              <h3 className="text-sm font-medium text-neutral-900">COLOR</h3>
              {openSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.color && (
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button 
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color) 
                        ? 'border-neutral-900 scale-110' 
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                    style={{ 
                      backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                     color.toLowerCase() === 'beige' ? '#F5F5DC' :
                                     color.toLowerCase() === 'navy' ? '#000080' :
                                     color.toLowerCase()
                    }}
                    onClick={() => handleColorToggle(color)}
                    title={color}
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
              <h3 className="text-sm font-medium text-neutral-900">SIZE</h3>
              {openSections.size ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.size && (
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button 
                    key={size}
                    className={`w-12 h-8 text-sm transition-all rounded ${
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
            className="w-full py-3 text-sm text-neutral-600 border border-neutral-300 hover:bg-neutral-50 transition-colors rounded"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default Pant;
