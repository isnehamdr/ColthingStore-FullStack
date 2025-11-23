import React from 'react';
import { Link } from '@inertiajs/react';
import Slider from 'react-slick';

// Import Slick CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Category = () => {
  const categories = [
    { src: "/images/c1.avif", label: "SHIRTS", route: '/shirt' },
    { src: "/images/c2.avif", label: "PANTS", route: '/pant' },
    { src: "/images/c3.avif", label: "JACKETS", route: '/jacket' },
    { src: "/images/c4.avif", label: "ALL PRODUCTS", route: '/allproduct' }
  ];

  // Enhanced Slick settings for mobile
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    adaptiveHeight: false,
    dotsClass: "slick-dots !bottom-6",
    customPaging: () => (
      <div className="w-2 h-2 bg-white/50 rounded-full hover:bg-white transition-all duration-300" />
    ),
  };

  return (
    <>
      <div className="py-12 md:py-16" style={{ fontFamily: 'Fraunces' }}>
        <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-center px-4">
          Shop By Category
        </h2>
      </div>

      {/* Desktop: Grid layout (hidden on small screens) */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 px-8 pb-8">
        {categories.map((item, index) => (
          <div key={index} className="relative group overflow-hidden ">
            <Link href={item.route} className="block w-full h-full">
              <img
                className="w-full h-full object-cover object-[59%_22%] group-hover:scale-105 transition-transform duration-300"
                src={item.src}
                alt={item.label}
              />
            </Link>
            <Link
              href={item.route}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black transition-all duration-300 border border-white rounded-2xl py-2 px-8 text-center hover:bg-gray-100 font-medium text-sm"
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile: Enhanced Slick Slider (visible only on small screens) */}
      <div className="md:hidden px-4 pb-8">
        <style>{`
          .slick-dots {
            bottom: 24px !important;
          }
          .slick-dots li {
            margin: 0 4px;
          }
          .slick-dots li div {
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transition: all 0.3s ease;
          }
          .slick-dots li.slick-active div {
            background: white;
            width: 24px;
            border-radius: 4px;
          }
          .slick-slider {
            border-radius: 12px;
            overflow: hidden;
          }
        `}</style>
        <Slider {...sliderSettings}>
          {categories.map((item, index) => (
            <div key={index}>
              <div className="relative overflow-hidden ">
                <Link href={item.route} className="block">
                  <div className="relative h-[60vh] min-h-[450px] max-h-[450px]">
                    <img
                      className="w-full h-full object-cover object-center"
                      src={item.src}
                      alt={item.label}
                    />
                    {/* Gradient overlay for better button visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                </Link>
                <Link
                  href={item.route}
                  className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white text-black border border-white rounded-full py-2.5 px-8 text-center font-medium text-sm shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                >
                  {item.label}
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Category;