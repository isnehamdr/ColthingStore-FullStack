import React, { useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('All products');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    color: true,
    size: true
  });

  // Sample data
  const categories = [
 
    { name: 'Jackets', path: '/jacket' },

    { name: 'Shirts', path: '/shirt' },
    { name: 'Pants', path: '/pant' },
    { name: 'All Clothes', path: '/allproduct' }
  ];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };

  const handlePriceChange = (e, index) => {
    const newValue = parseInt(e.target.value);
    const newRange = [...priceRange];
    newRange[index] = newValue;
    setPriceRange(newRange);
  };

  const applyFilters = () => {
    // Filter logic would go here
    console.log('Filters applied:', {
      category: activeCategory,
      priceRange,
      colors: selectedColors,
      sizes: selectedSizes
    });
  };

  const clearFilters = () => {
    setActiveCategory('All products');
    setPriceRange([0, 500]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-16 left-0 h-[calc(100vh-64px)] w-80 bg-white z-40 shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:block overflow-y-auto
      `}>
        {/* Close button for mobile */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6" style={{ fontFamily: 'Fraunces' }}>
          {/* Categories Section */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('categories')}
            >
              <h2 className="text-lg font-semibold text-gray-800">Browse By</h2>
              {openSections.categories ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
            
            {openSections.categories && (
              <>
                <div className="w-12 h-0.5 bg-gray-500 mb-4"></div>
                <ul className="space-y-3">
                  {categories.map(category => (
                    <li 
                      key={category.name}
                      className={`py-1 transition-colors duration-200 ${
                        activeCategory === category.name 
                          ? 'font-bold text-gray-900' 
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <a 
                        href={category.path}
                        className="block w-full"
                        onClick={() => setActiveCategory(category.name)}
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Price Filter Section */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('price')}
            >
              <h2 className="text-lg font-semibold text-gray-800">Price</h2>
              {openSections.price ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
            
            {openSections.price && (
              <>
                <div className="w-12 h-0.5 bg-gray-500 mb-4"></div>
                <div className="space-y-4">
                  <div className="px-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="500" 
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full mb-2"
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="500" 
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 px-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Color Filter Section */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('color')}
            >
              <h2 className="text-lg font-semibold text-gray-800">Color</h2>
              {openSections.color ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
            
            {openSections.color && (
              <>
                <div className="w-12 h-0.5 bg-gray-500 mb-4"></div>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map(color => (
                    <div 
                      key={color}
                      className={`flex items-center p-2 rounded cursor-pointer ${
                        selectedColors.includes(color) 
                          ? 'bg-gray-100 font-semibold' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleColorToggle(color)}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                        style={{ 
                          backgroundColor: color.toLowerCase() === 'white' 
                            ? '#ffffff' 
                            : color.toLowerCase() 
                        }}
                      ></div>
                      <span className="text-sm">{color}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Size Filter Section */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('size')}
            >
              <h2 className="text-lg font-semibold text-gray-800">Size</h2>
              {openSections.size ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
            
            {openSections.size && (
              <>
                <div className="w-12 h-0.5 bg-gray-500 mb-4"></div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <div 
                      key={size}
                      className={`w-10 h-10 flex items-center justify-center border rounded cursor-pointer ${
                        selectedSizes.includes(size) 
                          ? 'border-gray-900 bg-gray-100 font-semibold' 
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={applyFilters}
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
    </>
  );
};

export default Sidebar;