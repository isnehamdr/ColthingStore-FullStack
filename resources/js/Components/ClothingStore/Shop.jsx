import React from 'react';

const Shop = () => {
  return (
    <div className="pt-12">
      <div className="relative w-full h-[60vh] md:h-screen overflow-hidden">
        {/* Background image container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/full.avif" 
            alt="Fashion store with clothing racks" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center md:items-end justify-center h-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center md:text-right max-w-md lg:max-w-xl xl:max-w-2xl">
            <h2 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-2 md:mb-4 tracking-wide">
              Shop the dark
            </h2>
            <h2 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-8 tracking-wide">
              Tailored Pants Now!
            </h2>
            <a href="/allproduct">
              <button className="text-white py-2 px-8 sm:py-3 sm:px-12 border-2 border-white rounded-3xl italic text-sm sm:text-lg md:text-xl hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                Shop Now
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;