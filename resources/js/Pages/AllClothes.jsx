import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Footer from '@/Components/ClothingStore/Footer';
import Navbar from '@/Components/ClothingStore/Navbar';
import { useCart } from '@/contexts/CartContext';
import { formatNpr, buildFilterOptions, normalizeStorefrontProduct } from '@/utils/storefront';

const AllClothes = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All products');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { addToCart } = useCart();
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    color: true,
    size: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(route('ourproducts.index'));

      if (response.data.success) {
        const normalizedProducts = (response.data.data || []).map(normalizeStorefrontProduct);
        const maxPrice = Math.max(...normalizedProducts.map((product) => product.price), 0);

        setProducts(normalizedProducts);
        setPriceRange([0, maxPrice]);
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

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((item) => item !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  const maxAvailablePrice = Math.max(...products.map((product) => product.price), 0);
  const { colors, sizes, categories: productCategories } = buildFilterOptions(products);
  const categories = productCategories;

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !activeCategory ||
      String(product.category || '').toLowerCase() === activeCategory.toLowerCase();
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesColor =
      selectedColors.length === 0 ||
      selectedColors.some((color) =>
        (product.colors || []).some((productColor) =>
          productColor.toLowerCase().includes(color.toLowerCase())
        )
      );
    const matchesSize =
      selectedSizes.length === 0 ||
      selectedSizes.some((size) =>
        (product.sizes || []).some((productSize) =>
          productSize.toLowerCase().includes(size.toLowerCase())
        )
      );

    return matchesCategory && matchesPrice && matchesColor && matchesSize;
  });

  const clearFilters = () => {
    setActiveCategory('');
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, maxAvailablePrice]);
  };

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
      quantity: 1,
    });
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let index = 1; index <= 5; index += 1) {
      stars.push(
        <span key={index} className={index <= fullStars ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <>
      <Navbar />
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-black text-white p-3 rounded-full shadow-lg"
          aria-label="Open filters"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex min-h-screen pt-16">
        <div
          className={`
            lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] w-80 bg-white z-30 shadow-xl lg:shadow-md
            fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          `}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6" style={{ fontFamily: 'Fraunces' }}>
            <FilterSection
              title="Browse By"
              open={openSections.categories}
              onToggle={() => toggleSection('categories')}
            >
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li
                    key={category}
                    className={`py-1 transition-colors duration-200 ${
                      activeCategory === category ? 'font-bold text-gray-900' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <button type="button" className="block w-full text-left" onClick={() => setActiveCategory(category)}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <FilterSection title="Price" open={openSections.price} onToggle={() => toggleSection('price')}>
              <div className="space-y-4">
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max={maxAvailablePrice || 0}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        Math.min(Number(e.target.value), priceRange[1]),
                        priceRange[1],
                      ])
                    }
                    className="w-full mb-2"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxAvailablePrice || 0}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        Math.max(Number(e.target.value), priceRange[0]),
                      ])
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 px-2 gap-4">
                  <span>{formatNpr(priceRange[0])}</span>
                  <span>{formatNpr(priceRange[1])}</span>
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Color" open={openSections.color} onToggle={() => toggleSection('color')}>
              <div className="grid grid-cols-2 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`flex items-center p-2 rounded cursor-pointer ${
                      selectedColors.includes(color) ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleColorToggle(color)}
                  >
                    <div
                      className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() }}
                    />
                    <span className="text-sm">{color}</span>
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Size" open={openSections.size} onToggle={() => toggleSection('size')}>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`w-10 h-10 flex items-center justify-center border rounded cursor-pointer ${
                      selectedSizes.includes(size)
                        ? 'border-gray-900 bg-gray-100 font-semibold'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </FilterSection>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex-1 py-2 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:ml-0">
          <div className="px-4 py-8 lg:px-8" style={{ fontFamily: 'Fraunces' }}>
            {loading && (
              <div className="py-16 text-center">
                <div className="mt-8">Loading products...</div>
              </div>
            )}

            {error && !loading && (
              <div className="py-16 text-center">
                <div className="mt-8 text-red-500">{error}</div>
                <button onClick={fetchProducts} className="mt-4 px-4 py-2 bg-black text-white rounded">
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {showDetails && selectedProduct && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-end p-4">
                        <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                          ×
                        </button>
                      </div>
                      <div className="p-6 flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/2">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                          <div className="flex items-center mb-4">
                            <div className="flex text-sm">{renderRating(selectedProduct.rating)}</div>
                            <span className="ml-2 text-gray-600">({selectedProduct.reviews_count} reviews)</span>
                          </div>
                          <div className="mb-4">
                            <span className="text-2xl font-bold text-gray-900">{formatNpr(selectedProduct.price)}</span>
                            {selectedProduct.on_sale && (
                              <span className="text-lg text-gray-500 line-through ml-2">
                                {formatNpr(selectedProduct.original_price)}
                              </span>
                            )}
                          </div>
                          <p className="mb-4 text-gray-700">{selectedProduct.description || 'Premium quality product.'}</p>
                          <div className="mb-4">
                            <h3 className="font-semibold mb-2">Size</h3>
                            <div className="flex gap-2 flex-wrap">
                              {selectedProduct.sizes.map((size) => (
                                <button key={size} className="border border-gray-300 px-3 py-1 hover:bg-gray-100 rounded">
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <h3 className="font-semibold mb-2">Color</h3>
                            <div className="flex gap-2 flex-wrap">
                              {selectedProduct.colors.map((color) => (
                                <button key={color} className="border border-gray-300 px-3 py-1 hover:bg-gray-100 rounded">
                                  {color}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="relative group overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <div className="absolute top-2 left-2 z-10 flex gap-2">
                          {product.on_sale && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
                          )}
                        </div>

                        <div className="w-full h-80 overflow-hidden cursor-pointer" onClick={() => {
                          setSelectedProduct(product);
                          setShowDetails(true);
                        }}>
                          <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
                        </div>

                        <div className="p-4">
                          <a href={`/detailsproduct/${product.slug || product.id}`} className="font-medium text-gray-800 mb-1 hover:text-blue-600 transition-colors block">
                            <h3>{product.name}</h3>
                          </a>

                          <div className="flex items-center mb-2">
                            <div className="flex text-sm">{renderRating(product.rating)}</div>
                            <span className="text-xs text-gray-500 ml-1">({product.reviews_count})</span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-lg font-bold text-gray-900">{formatNpr(product.price)}</span>
                              {product.on_sale && (
                                <span className="text-sm text-gray-500 line-through">{formatNpr(product.original_price)}</span>
                              )}
                            </div>

                            {product.on_sale && (
                              <span className="text-xs font-bold text-red-600">
                                {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="mt-4 w-full rounded bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <p className="text-gray-600">No products found for the selected filters.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

const FilterSection = ({ title, open, onToggle, children }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={onToggle}>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {open ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </div>

    {open && (
      <>
        <div className="w-12 h-0.5 bg-gray-500 mb-4" />
        {children}
      </>
    )}
  </div>
);

export default AllClothes;
