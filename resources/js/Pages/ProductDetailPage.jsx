// ProductDetailPage.jsx
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
import Navbar from '@/Components/ClothingStore/Navbar';
import Footer from '@/Components/ClothingStore/Footer';
import axios from 'axios';
import { DEFAULT_PRODUCT_IMAGE, getImageUrl } from '@/utils/media';
import { formatNpr, normalizeStorefrontProduct } from '@/utils/storefront';

const ProductDetailPage = ({ slug: propSlug }) => {
  // Get slug from props (Inertia) or from URL as fallback
  const slug = propSlug || window.location.pathname.split('/').pop();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
//   const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { addToCart } = useCart();

  useEffect(() => {
    if (slug) {
      fetchProductDetails();
    } else {
      setError('Invalid product URL');
      setLoading(false);
    }
  }, [slug]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.get(route('ourproducts.index'));
      const items = response.data?.data || [];
      const foundProduct = items.find((item) => item.slug === slug);

      if (foundProduct) {
        const normalized = normalizeBackendProduct(foundProduct);
        setProduct(normalized);
        setSelectedSize(normalized.sizes?.[0] || '');
        setSelectedColor(normalized.colors?.[0] || '');
        setError(null);
      } else {
        fetchFromLocalData();
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      fetchFromLocalData();
    }
  };

  const fetchFromLocalData = () => {
    try {
      // Your provided JSON data
      const localProducts = {
        products: [
          {
            id: 1,
            slug: "washed-blue-denim-jacket",
            name: "Washed Blue Denim Jacket",
            price: 99.00,
            original_price: 129.00,
            discount_price: 99.00,
            category: "Jackets",
            description: "Classic denim jacket with a comfortable washed finish. Perfect for layering over any outfit.",
            image_url: "/images/t1.avif",
            images: [
              {
                id: 1,
                image_path: "/images/t1.avif",
                alt_text: "Washed Blue Denim Jacket front view"
              },
              {
                id: 2,
                image_path: "/images/c1.avif",
                alt_text: "Washed Blue Denim Jacket back view"
              },
              {
                id: 3,
                image_path: "/images/c2.avif",
                alt_text: "Washed Blue Denim Jacket side view"
              },
              {
                id: 4,
                image_path: "/images/c3.avif",
                alt_text: "Washed Blue Denim Jacket detail view"
              }
            ],
            sizes: ["XS", "S", "M", "L", "XL"],
            colors: ["Light Blue", "Medium Blue", "Dark Blue"],
            rating: 4.5,
            reviews_count: 28,
            stock: 15,
            in_stock: true,
            is_new: false,
            on_sale: true,
            seller_id: 1,
            seller_name: "Roon Apparel",
            features: [
              "Premium denim material",
              "Comfortable washed finish",
              "Classic fit",
              "Versatile styling options"
            ],
            care_instructions: [
              "Machine wash cold",
              "Do not bleach",
              "Tumble dry low",
              "Iron on low heat"
            ],
            sku: "DJ001-BL",
            created_at: "2024-01-15T00:00:00Z",
            updated_at: "2024-01-15T00:00:00Z"
          },
          {
            id: 2,
            slug: "classic-white-t-shirt",
            name: "Classic White T-Shirt",
            price: 49.00,
            original_price: 69.00,
            discount_price: 49.00,
            category: "T-Shirts",
            description: "Essential white t-shirt made from premium cotton. The perfect foundation for any wardrobe.",
            image_url: "/images/t2.avif",
            images: [
              {
                id: 5,
                image_path: "/images/t2.avif",
                alt_text: "Classic White T-Shirt front view"
              },
              {
                id: 6,
                image_path: "/images/t2.avif",
                alt_text: "Classic White T-Shirt back view"
              },
              {
                id: 7,
                image_path: "/images/c2.avif",
                alt_text: "Classic White T-Shirt side view"
              },
              {
                id: 8,
                image_path: "/images/c3.avif",
                alt_text: "Classic White T-Shirt detail view"
              }
            ],
            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
            colors: ["White", "Off-White", "Cream"],
            rating: 4.8,
            reviews_count: 42,
            stock: 25,
            in_stock: true,
            is_new: true,
            on_sale: true,
            seller_id: 1,
            seller_name: "Roon Apparel",
            features: [
              "100% premium cotton",
              "Regular fit",
              "Reinforced neckline",
              "Easy to care for"
            ],
            care_instructions: [
              "Machine wash cold",
              "Do not bleach",
              "Tumble dry low",
              "Iron on medium heat"
            ],
            sku: "TS002-WH",
            created_at: "2024-01-20T00:00:00Z",
            updated_at: "2024-01-20T00:00:00Z"
          },
          {
            id: 3,
            slug: "slim-black-trousers",
            name: "Slim Black Trousers",
            price: 89.00,
            original_price: 119.00,
            discount_price: 89.00,
            category: "Pants",
            description: "Elegant slim-fit trousers in classic black. Ideal for both formal and casual occasions.",
            image_url: "/images/t3.avif",
            images: [
              {
                id: 9,
                image_path: "/images/t3.avif",
                alt_text: "Slim Black Trousers front view"
              },
              {
                id: 10,
                image_path: "/images/t3.avif",
                alt_text: "Slim Black Trousers back view"
              },
              {
                id: 11,
                image_path: "/images/c2.avif",
                alt_text: "Slim Black Trousers side view"
              },
              {
                id: 12,
                image_path: "/images/c4.avif",
                alt_text: "Slim Black Trousers detail view"
              }
            ],
            sizes: ["28", "30", "32", "34", "36"],
            colors: ["Black", "Charcoal", "Navy"],
            rating: 4.3,
            reviews_count: 31,
            stock: 18,
            in_stock: true,
            is_new: false,
            on_sale: true,
            seller_id: 1,
            seller_name: "Roon Apparel",
            features: [
              "Slim fit design",
              "Premium fabric",
              "Comfortable waistband",
              "Versatile styling"
            ],
            care_instructions: [
              "Dry clean recommended",
              "Iron on low heat",
              "Do not tumble dry",
              "Store on hanger"
            ],
            sku: "PT003-BK",
            created_at: "2024-01-10T00:00:00Z",
            updated_at: "2024-01-10T00:00:00Z"
          },
          {
            id: 4,
            slug: "knit-beanie-hat",
            name: "Knit Beanie Hat",
            price: 29.00,
            original_price: 39.00,
            discount_price: 29.00,
            category: "Accessories",
            description: "Soft knit beanie for cooler days. Comfortable, stylish, and versatile.",
            image_url: "/images/t4.avif",
            images: [
              {
                id: 13,
                image_path: "/images/t4.avif",
                alt_text: "Knit Beanie Hat front view"
              },
              {
                id: 14,
                image_path: "/images/t4.avif",
                alt_text: "Knit Beanie Hat back view"
              },
              {
                id: 15,
                image_path: "/images/c1.avif",
                alt_text: "Knit Beanie Hat side view"
              },
              {
                id: 16,
                image_path: "/images/c2.avif",
                alt_text: "Knit Beanie Hat detail view"
              }
            ],
            sizes: ["One Size"],
            colors: ["Black", "Gray", "Navy", "Cream"],
            rating: 4.6,
            reviews_count: 19,
            stock: 30,
            in_stock: true,
            is_new: true,
            on_sale: true,
            seller_id: 1,
            seller_name: "Roon Apparel",
            features: [
              "Soft knit material",
              "One size fits most",
              "Comfortable fit",
              "Versatile accessory"
            ],
            care_instructions: [
              "Hand wash recommended",
              "Lay flat to dry",
              "Do not tumble dry",
              "Do not iron"
            ],
            sku: "AC004-BK",
            created_at: "2024-01-25T00:00:00Z",
            updated_at: "2024-01-25T00:00:00Z"
          }
        ]
      };

      const foundProduct = localProducts.products.find(p => p.slug === slug);
      
      if (foundProduct) {
        const normalized = normalizeBackendProduct(foundProduct);
        setProduct(normalized);
        setSelectedSize(normalized.sizes?.[0] || '');
        setSelectedColor(normalized.colors?.[0] || '');
        setError(null);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

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
      price: product.price,
      originalPrice: product.original_price,
      image: product.images && product.images[0] ? product.images[0].image_path : '/images/placeholder-jacket.jpg',
      sellerId: product.seller_id || 1,
      sellerName: product.seller_name || 'Roon Apparel',
      size: selectedSize,
      color: selectedColor,
      slug: product.slug,
      quantity: quantity
    };

    addToCart(cartProduct);

    toast.success(`${product.name} added to cart!`, {
      duration: 3000,
      position: 'bottom-right',
      icon: '🛒',
      style: { background: '#000000', color: 'white', fontWeight: '500' }
    });
  };

//   const handleWishlist = () => {
//     setIsWishlisted(!isWishlisted);
//     toast.success(
//       isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
//       {
//         position: 'bottom-right',
//         style: { background: '#000000', color: 'white' }
//       }
//     );
//   };

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
    window.history.back();
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

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">{error || 'Product not found'}</p>
          <button 
            onClick={goBack} 
            className="px-6 py-2 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ image_path: DEFAULT_PRODUCT_IMAGE }];

  function normalizeBackendProduct(productData) {
    const normalized = normalizeStorefrontProduct(productData);
    const images = productData?.images?.length
      ? productData.images.map((image) => ({
          ...image,
          image_path: getImageUrl(image.image_path, DEFAULT_PRODUCT_IMAGE),
        }))
      : [{ image_path: normalized.image }];

    return {
      ...normalized,
      in_stock: Number(productData?.stock || 0) > 0,
      is_new: Boolean(productData?.is_new),
      images,
      sizes:
        normalized.sizes && normalized.sizes.length > 0 ? normalized.sizes : ['M'],
      colors:
        normalized.colors && normalized.colors.length > 0 ? normalized.colors : ['Default'],
      features: productData?.features || [
        'Premium quality fabric',
        'Comfortable fit',
        'Durable material',
      ],
      care_instructions: productData?.care_instructions || [
        'Machine wash cold',
        'Tumble dry low',
        'Iron on low heat',
      ],
      seller_id: productData?.seller_id || 1,
      seller_name: productData?.seller_name || 'Roon Apparel',
      sku: productData?.sku || productData?.id,
    };
  }

  return (<>
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
            <span className="text-sm tracking-wide">Back</span>
          </button>
        </div>
      </div> */}

      {/* Breadcrumb */}
      {/* <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-neutral-600 hover:text-neutral-900">Home</a>
            <span className="text-neutral-400">/</span>
            <a href="/ourproducts" className="text-neutral-600 hover:text-neutral-900">Products</a>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900">{product.name}</span>
          </div>
        </div>
      </div> */}

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
                  e.target.src = '/images/placeholder-jacket.jpg';
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && (
                  <span className="bg-neutral-900 text-white text-xs px-3 py-1 tracking-wider">NEW</span>
                )}
                {product.on_sale && (
                  <span className="bg-red-600 text-white text-xs px-3 py-1 tracking-wider font-medium">
                    SALE {Math.round((1 - product.price / product.original_price) * 100)}%
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
                        e.target.src = '/images/placeholder-jacket.jpg';
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
                {formatNpr(product.price)}
              </span>
              {product.on_sale && (
                <>
                  <span className="text-2xl text-neutral-400 line-through">
                    {formatNpr(product.original_price)}
                  </span>
                  <span className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1">
                    Save {formatNpr(product.original_price - product.price)}
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
                    disabled={quantity >= (product.stock || 10)}
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
                {/* <button 
                  onClick={handleWishlist}
                  className={`py-4 text-sm tracking-wider font-medium border-2 transition-all flex items-center justify-center gap-2 ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-600 text-red-600' 
                      : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                  WISHLIST
                </button> */}
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
                      <dd className="text-neutral-900 font-medium">{product.sku || product.id}</dd>
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
                    {product.care_instructions && product.care_instructions.length > 0 ? (
                      product.care_instructions.map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))
                    ) : (
                      <>
                        <li>• Machine wash cold with like colors</li>
                        <li>• Do not bleach</li>
                        <li>• Tumble dry low</li>
                        <li>• Iron on low heat if needed</li>
                      </>
                    )}
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

export default ProductDetailPage;
