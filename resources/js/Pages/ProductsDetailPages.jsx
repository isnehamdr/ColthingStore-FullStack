// ProductsDetailPages.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  StarHalf, 
  Truck, 
  RefreshCw, 
  Shield, 
  Share2,
  Minus,
  Plus,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { router, usePage } from '@inertiajs/react';
import Navbar from '@/Components/ClothingStore/Navbar';
import Footer from '@/Components/ClothingStore/Footer';
import axios from 'axios';

const ProductsDetailPages = () => {
  const { props } = usePage();
  const slug = props.slug;

  const imagepath= import.meta.env.VITE_IMAGE_PATH
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { addToCart } = useCart();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!slug) {
        setError("Product slug is missing");
        setLoading(false);
        return;
      }

      console.log("Fetching product with slug:", slug);

      // Try to fetch the specific product by slug
      try {
        // First try the specific endpoint if it exists
        const response = await axios.get(`/api/products/${slug}`);
        console.log("Product API response:", response.data);
        
        if (response.data.success) {
          const productData = response.data.data || response.data.product;
          processProductData(productData);
        } else {
          // Fallback: fetch all products and filter
          fetchAllProducts();
        }
      } catch (apiError) {
        console.log("Specific product API failed, falling back to all products");
        // Fallback: fetch all products and filter by slug
        fetchAllProducts();
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again later.');
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(route('ourproducts.index'));
      console.log("All products response:", response.data);

      let allProducts = [];
      
      // Handle different response structures
      if (response.data.success && response.data.data) {
        allProducts = response.data.data;
      } else if (Array.isArray(response.data)) {
        allProducts = response.data;
      } else if (response.data.products) {
        allProducts = response.data.products;
      }

      console.log("Processed products array:", allProducts);

      // Find product by slug - handle different slug field names
      const foundProduct = allProducts.find((p) => 
        p.slug === slug || 
        (p.product_name && p.product_name.toLowerCase().replace(/\s+/g, '-') === slug) ||
        p.id === parseInt(slug)
      );

      if (!foundProduct) {
        setError("Product not found");
        setProduct(null);
      } else {
        processProductData(foundProduct);
      }
    } catch (err) {
      console.error('Error fetching all products:', err);
      setError('Failed to load product. Please try again later.');
      setLoading(false);
    }
  };

  const processProductData = (productData) => {
    console.log("Processing product data:", productData);
    
    // Normalize product data structure
    const normalizedProduct = {
      id: productData.id,
      name: productData.product_name || productData.name || 'Product Name',
      slug: productData.slug || productData.id,
      description: productData.description || 'No description available.',
      price: parseFloat(productData.price) || 0,
      discount_price: productData.discount_price ? parseFloat(productData.discount_price) : null,
      original_price: parseFloat(productData.original_price) || parseFloat(productData.price) || 0,
      on_sale: !!productData.discount_price,
      is_new: productData.is_new || false,
      in_stock: productData.in_stock !== undefined ? productData.in_stock : true,
      stock: productData.stock || 10,
      rating: parseFloat(productData.rating) || 4.0,
      reviews_count: productData.reviews_count || 0,
      category: productData.category || 'Shirts',
      sku: productData.sku || productData.id,
      seller_id: productData.seller_id || 1,
      seller_name: productData.seller_name || 'Roon Apparel',
      
      // Handle sizes - could be array, string, or comma-separated
      sizes: Array.isArray(productData.sizes) 
        ? productData.sizes 
        : typeof productData.size === 'string' 
          ? productData.size.split(',').map(s => s.trim()) 
          : productData.sizes || ['M', 'L', 'XL'],
          
      // Handle colors - could be array, string, or comma-separated
      colors: Array.isArray(productData.colors) 
        ? productData.colors 
        : typeof productData.color === 'string' 
          ? productData.color.split(',').map(c => c.trim()) 
          : productData.colors || ['Black', 'White', 'Gray'],
      
      // Handle images
      images: (productData.images && productData.images.length > 0) 
        ? productData.images.map(img => ({
            ...img,
            image_path: img.image_path.startsWith('http') 
              ? img.image_path 
              : img.image_path.startsWith(`${imagepath}/`)
                ? img.image_path
                : `${imagepath}/${img.image_path}`
          }))
        : [{ image_path: '/images/placeholder-shirt.jpg' }],
      
      features: productData.features || [
        'Premium quality fabric',
        'Comfortable fit',
        'Durable material'
      ],
      care_instructions: productData.care_instructions || [
        'Machine wash cold',
        'Tumble dry low',
        'Iron on low heat'
      ]
    };

    setProduct(normalizedProduct);
    setSelectedSize(normalizedProduct.sizes[0] || '');
    setSelectedColor(normalizedProduct.colors[0] || '');
    setLoading(false);
  };

  useEffect(() => {
    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  // Rest of your component functions remain the same...
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color', {
        position: 'bottom-right',
        style: { background: '#ef4444', color: 'white' }
      });
      return;
    }

    const cartProduct = {
      productId: product.id,
      title: product.name,
      price: product.discount_price || product.price,
      originalPrice: product.original_price,
      image: product.images && product.images[0] ? product.images[0].image_path : '/images/placeholder-shirt.jpg',
      sellerId: product.seller_id || 1,
      sellerName: product.seller_name || 'Roon Apparel',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      slug: product.slug
    };

    addToCart(cartProduct);

    toast.success(`${product.name} added to cart!`, {
      duration: 3000,
      position: 'bottom-right',
      icon: '🛒',
      style: { background: '#000000', color: 'white', fontWeight: '500' }
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', {
        position: 'bottom-right',
        style: { background: '#000000', color: 'white' }
      });
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const goBack = () => {
    router.visit('/shirt'); // Go back to shirts page instead of all products
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600 text-sm tracking-wide">Loading product...</p>
        </div>
      </div>
    );
  }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-neutral-50">
//         <div className="text-center space-y-4">
//           <p className="text-neutral-600">{error || 'Product not found'}</p>
//           <button 
//             onClick={goBack} 
//             className="px-6 py-2 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-800 transition-colors"
//           >
//             Go Back to Shirts
//           </button>
//         </div>
//       </div>
//     );
//   }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ image_path: '/images/placeholder-shirt.jpg' }];

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-white">
        <Toaster position="bottom-right" />

        {/* Back Button */}
        {/* <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm tracking-wide">Back to Shirts</span>
            </button>
          </div>
        </div> */}

        {/* The rest of your JSX remains the same */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group">
                <img 
                  src={productImages[selectedImageIndex].image_path}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-shirt.jpg';
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_new && (
                    <span className="bg-neutral-900 text-white text-xs px-3 py-1 tracking-wider">NEW</span>
                  )}
                  {product.on_sale && product.discount_price && (
                    <span className="bg-red-600 text-white text-xs px-3 py-1 tracking-wider font-medium">
                      SALE {Math.round((1 - product.discount_price / product.original_price) * 100)}%
                    </span>
                  )}
                </div>

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square border-2 transition-all overflow-hidden ${
                        selectedImageIndex === index 
                          ? 'border-neutral-900' 
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <img 
                        src={image.image_path}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-shirt.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-neutral-900 mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderRating(product.rating)}
                    </div>
                    <span className="text-sm text-neutral-600">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-neutral-500">
                    ({product.reviews_count} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-light text-neutral-900">
                  ${(product.discount_price || product.price).toFixed(2)}
                </span>
                {product.on_sale && product.discount_price && (
                  <>
                    <span className="text-2xl text-neutral-400 line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                    <span className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1">
                      Save ${(product.original_price - product.discount_price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.in_stock ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">In Stock ({product.stock} available)</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed border-t border-neutral-200 pt-6">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="space-y-3">
                <label className="text-sm tracking-wider font-medium text-neutral-900">
                  SIZE: <span className="font-normal text-neutral-600">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      className={`w-14 h-14 text-sm tracking-wide transition-all ${
                        selectedSize === size 
                          ? 'bg-neutral-900 text-white' 
                          : 'bg-white text-neutral-700 border-2 border-neutral-300 hover:border-neutral-900'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <label className="text-sm tracking-wider font-medium text-neutral-900">
                  COLOR: <span className="font-normal text-neutral-600">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      className={`px-6 py-3 text-sm tracking-wide transition-all ${
                        selectedColor === color 
                          ? 'bg-neutral-900 text-white' 
                          : 'bg-white text-neutral-700 border-2 border-neutral-300 hover:border-neutral-900'
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-3">
                <label className="text-sm tracking-wider font-medium text-neutral-900">
                  QUANTITY
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-neutral-300">
                    <button 
                      onClick={decrementQuantity}
                      className="p-3 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 text-lg font-medium">{quantity}</span>
                    <button 
                      onClick={incrementQuantity}
                      className="p-3 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6">
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="w-full bg-neutral-900 text-white py-4 text-sm tracking-wider font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.in_stock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleShare}
                    className="py-4 text-sm tracking-wider font-medium border-2 border-neutral-300 text-neutral-700 hover:border-neutral-900 transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    SHARE
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
                <div className="text-center space-y-2">
                  <Truck className="w-8 h-8 mx-auto text-neutral-700" />
                  <p className="text-xs text-neutral-600">Free Shipping</p>
                </div>
                <div className="text-center space-y-2">
                  <RefreshCw className="w-8 h-8 mx-auto text-neutral-700" />
                  <p className="text-xs text-neutral-600">Easy Returns</p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="w-8 h-8 mx-auto text-neutral-700" />
                  <p className="text-xs text-neutral-600">Secure Payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16 border-t border-neutral-200">
            <div className="flex gap-8 border-b border-neutral-200">
              {['description', 'details', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm tracking-wider font-medium transition-colors relative ${
                    activeTab === tab 
                      ? 'text-neutral-900' 
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {tab.toUpperCase()}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-neutral-600 leading-relaxed">
                    {product.description}
                  </p>
                  {product.features && product.features.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium text-neutral-900 mt-6 mb-3">Key Features:</h3>
                      <ul className="space-y-2 text-neutral-600">
                        {product.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">Product Details</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-neutral-200">
                        <dt className="text-neutral-600">Category:</dt>
                        <dd className="text-neutral-900 font-medium">{product.category}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-neutral-200">
                        <dt className="text-neutral-600">Available Sizes:</dt>
                        <dd className="text-neutral-900 font-medium">{product.sizes.join(', ')}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-neutral-200">
                        <dt className="text-neutral-600">Available Colors:</dt>
                        <dd className="text-neutral-900 font-medium">{product.colors.join(', ')}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-neutral-200">
                        <dt className="text-neutral-600">SKU:</dt>
                        <dd className="text-neutral-900 font-medium">{product.sku}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-neutral-200">
                        <dt className="text-neutral-600">Seller:</dt>
                        <dd className="text-neutral-900 font-medium">{product.seller_name}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">Care Instructions</h3>
                    <ul className="space-y-2 text-neutral-600">
                      {product.care_instructions.map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-5xl font-light text-neutral-900 mb-2">{product.rating.toFixed(1)}</div>
                      <div className="flex justify-center mb-1">
                        {renderRating(product.rating)}
                      </div>
                      <p className="text-sm text-neutral-600">{product.reviews_count} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm text-neutral-600 w-8">{star} ★</span>
                          <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-400"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-500 text-center py-8">
                    {product.reviews_count === 0 
                      ? "No reviews yet. Be the first to review this product!" 
                      : "Customer reviews will be displayed here."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProductsDetailPages;