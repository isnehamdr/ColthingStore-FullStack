// Hero.jsx
import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react'; // ✅ Import from Inertia

const Hero = () => {
	const [activeCategory, setActiveCategory] = useState('Jacket');

	const categories = [
		{ id: 'Jacket', label: 'Jacket', href: '/jacket' },
		{ id: 'Pants', label: 'Pants', href: '/pant' },
		{ id: 'Shirts', label: 'Shirts', href: '/shirt' },
		{ id: 'All Product', label: 'All Product', href: '/allproduct' },
	];

	const handleCategoryClick = (category) => {
		setActiveCategory(category.id);
		router.get(category.href); // ✅ Inertia navigation
	};

	return (
		<>
			<div className="bg-white border-b border-gray-200 sm:pt-0 pt-4" style={{ fontFamily: 'Fraunces' }}>
				<div className="grid grid-cols-1 lg:grid-cols-12">
					{/* Left Side - Rotated ROON Text */}
					<div className="col-span-1 lg:col-span-3 flex justify-center lg:justify-center items-center bg-white pb-4">
						<h1 className='text-6xl py-0 lg:py-24 sm:text-7xl lg:text-[12em] font-light text-black uppercase transform lg:rotate-[-270deg] tracking-[0.2em]'>
							ROON
						</h1>
					</div>

					{/* Right Side - Hero Image */}
					<div className="col-span-1 lg:col-span-9 relative overflow-hidden">
						<img 
							src="/images/hero.avif" 
							alt="Roon Apparel Spring Collection" 
							className="w-full md:h-[120vh] h-[70vh] object-cover"
							style={{ objectPosition: '50% 0%' }}
						/>
						
						{/* Text Overlay on Image */}
						<div className="absolute text-white bottom-8 sm:bottom-12 lg:bottom-48 left-8 sm:left-12 lg:left-16 z-10">
							<h2 className='text-2xl sm:text-3xl mb-2 font-light tracking-wide italic'>
								2035/<span className="italic">Spring</span>
							</h2>
							<h2 className='text-2xl sm:text-3xl mb-6 font-light tracking-wide'>
								Collection
							</h2>
							{/* ✅ Use Inertia Link or router.get */}
							<button 
								className='italic border-2 border-white hover:bg-white hover:text-black transition-all duration-300 py-2 px-8 rounded-full text-md mb-8'
								onClick={() => router.get('/allproduct')}
							>
								Shop Now
							</button>
						</div>
					</div>
				</div>

				{/* Category Buttons - Mobile only */}
				<div className="md:hidden flex justify-center items-center space-x-8 lg:space-x-12 py-6 border-t border-gray-200">
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => handleCategoryClick(category)}
							className={`text-sm lg:text-base font-light tracking-wider transition-all duration-300 ${
								activeCategory === category.id
									? 'text-black border-b-2 border-black'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							{category.label}
						</button>
					))}
				</div>
			</div>
		</>
	);
};

export default Hero;