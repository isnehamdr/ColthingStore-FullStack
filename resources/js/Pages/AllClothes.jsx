import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Footer from '@/Components/ClothingStore/Footer';
import Navbar from '@/Components/ClothingStore/Navbar';

const AllClothes = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeFilter, setActiveFilter] = useState('all');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const imagepath= import.meta.env.VITE_IMAGE_PATH

	// Sidebar state
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState('All products');
	const [priceRange, setPriceRange] = useState([0, 500]);
	const [selectedColors, setSelectedColors] = useState([]);
	const [selectedSizes, setSelectedSizes] = useState([]);
	const [openSections, setOpenSections] = useState({categories: true, price: true, color: true, size: true});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await axios.get(route('ourproducts.index'));

			if (response.data.success) {
				const normalizedProducts = response.data.data.map(product => ({
					...product,
					name: product.product_name,
					label: product.product_name,
					image_url: product.image_url || '/images/placeholder-shirt.jpg',
					rating: product.rating || 4.0,
					reviews_count: product.reviews_count || 0,
					original_price: parseFloat(product.price),
					price: product.discount_price ? parseFloat(product.discount_price) : parseFloat(product.price),
					on_sale: !!product.discount_price,
					is_new: product.is_new || false,
					sizes: typeof product.size === 'string' ? product.size.split(',').map(s => s.trim()) : product.size || ['M'],
					colors: typeof product.color === 'string' ? product.color.split(',').map(c => c.trim()) : product.color || ['White']
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

	// Sidebar handlers
	const toggleSection = (section) => {
		setOpenSections(prev => ({
			...prev,
			[section]: !prev[section]
		}));
	};

	const handleColorToggle = (color) => {
		setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [
			...prev,
			color
		]);
	};

	const handleSizeToggle = (size) => {
		setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [
			...prev,
			size
		]);
	};

	const handlePriceChange = (e, index) => {
		const newValue = parseInt(e.target.value);
		const newRange = [...priceRange];
		newRange[index] = newValue;
		setPriceRange(newRange);
	};

	const applyFilters = () => { // You can implement actual filtering logic here
		console.log('Filters applied:', {
			category: activeCategory,
			priceRange,
			colors: selectedColors,
			sizes: selectedSizes
		});
		// Example: Filter products based on selected filters
	};

	const clearFilters = () => {
		setActiveCategory('All products');
		setPriceRange([0, 500]);
		setSelectedColors([]);
		setSelectedSizes([]);
	};

	// Product handlers
	const handleProductSelect = (product) => {
		setSelectedProduct(product);
		setShowDetails(true);
		window.scrollTo({top: 0, behavior: 'smooth'});
	};

	const renderRating = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 1; i <= 5; i++) {
			if (i <= fullStars) {
				stars.push (
					<span key={i}
						className="text-yellow-400">★</span>
				);
			} else if (i === fullStars + 1 && hasHalfStar) {
				stars.push (
					<span key={i}
						className="text-yellow-400">★</span>
				);
			} else {
				stars.push (
					<span key={i}
						className="text-gray-300">★</span>
				);
			}
		}
		return stars;
	};

	const filteredProducts = activeFilter === 'all' ? products : products.filter(product => product.category === activeFilter);

	// Sample data for sidebar
	const categories = [
		{
			name: 'All products',
			path: '/home'
		},
		{
			name: 'Jackets',
			path: '/jacket'
		},
		{
			name: 'Jeans',
			path: '/jacket'
		},
		{
			name: 'Shirts',
			path: '/shirt'
		}, {
			name: 'Pants',
			path: '/pant'
		}, {
			name: 'All Clothes',
			path: '/allproduct'
		}
	];
	const colors = [
		'Black',
		'White',
		'Blue',
		'Red',
		'Green',
		'Gray'
	];
	const sizes = [
		'XS',
		'S',
		'M',
		'L',
		'XL',
		'XXL'
	];

	return (
		<>
			<Navbar/> {/* Mobile Filter Button — Only visible on mobile */}
			<div className="lg:hidden fixed bottom-6 right-6 z-30">
				<button onClick={
						() => setSidebarOpen(true)
					}
					className="bg-black text-white p-3 rounded-full shadow-lg"
					aria-label="Open filters">
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round"
							strokeWidth={2}
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
					</svg>
				</button>
			</div>

			{/* Sidebar Overlay (Mobile Only) */}
			{
			sidebarOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={
						() => setSidebarOpen(false)
				}></div>
			)
		}

			{/* Main Content Container */}
			<div className="flex min-h-screen pt-16">
				{/* Sidebar */}
				{/* <div className={`
					lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] w-80 bg-white z-30 shadow-xl lg:shadow-md
					fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
					${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
					overflow-y-auto lg:overflow-y-auto
				`}> */}
				<div className={
					`
	lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] w-80 bg-white z-30 shadow-xl lg:shadow-md
	fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
	${
						sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
					}
	overflow-y-auto lg:overflow-y-auto
	[&::-webkit-scrollbar]:hidden
	[-ms-overflow-style:none]
	[scrollbar-width:none]
`
				}>
					{/* Close button for mobile */}
					<div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden">
						<h2 className="text-xl font-semibold">Filters</h2>
						<button onClick={
								() => setSidebarOpen(false)
							}
							className="p-1 rounded-full hover:bg-gray-100">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"/>
							</svg>
						</button>
					</div>

					<div className="p-6"
						style={
							{fontFamily: 'Fraunces'}
					}>
						{/* Categories Section */}
						<div className="mb-8">
							<div className="flex justify-between items-center cursor-pointer mb-4"
								onClick={
									() => toggleSection('categories')
							}>
								<h2 className="text-lg font-semibold text-gray-800">Browse By</h2>
								{
								openSections.categories ? (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round"
											strokeWidth={2}
											d="M5 15l7-7 7 7"/>
									</svg>
								) : (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"/>
									</svg>
								)
							} </div>

							{
							openSections.categories && (
								<>
									<div className="w-12 h-0.5 bg-gray-500 mb-4"></div>
									<ul className="space-y-3">
										{
										categories.map(category => (
											<li key={
													category.name
												}
												className={
													`py-1 transition-colors duration-200 ${
														activeCategory === category.name ? 'font-bold text-gray-900' : 'text-gray-700 hover:text-gray-900'
													}`
											}>
												<a href={
														category.path
													}
													className="block w-full"
													onClick={
														() => setActiveCategory(category.name)
												}>
													{
													category.name
												} </a>
											</li>
										))
									} </ul>
								</>
							)
						} </div>

						{/* Price Filter Section */}
						<div className="mb-8">
							<div className="flex justify-between items-center cursor-pointer mb-4"
								onClick={
									() => toggleSection('price')
							}>
								<h2 className="text-lg font-semibold text-gray-800">Price</h2>
								{
								openSections.price ? (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round"
											strokeWidth={2}
											d="M5 15l7-7 7 7"/>
									</svg>
								) : (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"/>
									</svg>
								)
							} </div>

							{
							openSections.price && (
								<>
									<div className="w-12 h-0.5 bg-gray-500 mb-4"></div>
									<div className="space-y-4">
										<div className="px-2">
											<input type="range" min="0" max="500"
												value={
													priceRange[0]
												}
												onChange={
													(e) => handlePriceChange(e, 0)
												}
												className="w-full mb-2"/>
											<input type="range" min="0" max="500"
												value={
													priceRange[1]
												}
												onChange={
													(e) => handlePriceChange(e, 1)
												}
												className="w-full"/>
										</div>
										<div className="flex justify-between text-sm text-gray-600 px-2">
											<span>${
												priceRange[0]
											}</span>
											<span>${
												priceRange[1]
											}</span>
										</div>
									</div>
								</>
							)
						} </div>

						{/* Color Filter Section */}
						<div className="mb-8">
							<div className="flex justify-between items-center cursor-pointer mb-4"
								onClick={
									() => toggleSection('color')
							}>
								<h2 className="text-lg font-semibold text-gray-800">Color</h2>
								{
								openSections.color ? (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round"
											strokeWidth={2}
											d="M5 15l7-7 7 7"/>
									</svg>
								) : (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"/>
									</svg>
								)
							} </div>

							{
							openSections.color && (
								<>
									<div className="w-12 h-0.5 bg-gray-500 mb-4"></div>
									<div className="grid grid-cols-3 gap-2">
										{
										colors.map(color => (
											<div key={color}
												className={
													`flex items-center p-2 rounded cursor-pointer ${
														selectedColors.includes(color) ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
													}`
												}
												onClick={
													() => handleColorToggle(color)
											}>
												<div className="w-4 h-4 rounded-full mr-2 border border-gray-300"
													style={
														{
															backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase()
														}
												}></div>
												<span className="text-sm">
													{color}</span>
											</div>
										))
									} </div>
								</>
							)
						} </div>

						{/* Size Filter Section */}
						<div className="mb-8">
							<div className="flex justify-between items-center cursor-pointer mb-4"
								onClick={
									() => toggleSection('size')
							}>
								<h2 className="text-lg font-semibold text-gray-800">Size</h2>
								{
								openSections.size ? (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round"
											strokeWidth={2}
											d="M5 15l7-7 7 7"/>
									</svg>
								) : (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"/>
									</svg>
								)
							} </div>

							{
							openSections.size && (
								<>
									<div className="w-12 h-0.5 bg-gray-500 mb-4"></div>
									<div className="flex flex-wrap gap-2">
										{
										sizes.map(size => (
											<div key={size}
												className={
													`w-10 h-10 flex items-center justify-center border rounded cursor-pointer ${
														selectedSizes.includes(size) ? 'border-gray-900 bg-gray-100 font-semibold' : 'border-gray-300 hover:border-gray-500'
													}`
												}
												onClick={
													() => handleSizeToggle(size)
											}>
												{size} </div>
										))
									} </div>
								</>
							)
						} </div>

						{/* Action Buttons */}
						<div className="flex gap-4 mt-8">
							<button onClick={applyFilters}
								className="flex-1 py-2 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
								Apply Filters
							</button>
							<button onClick={clearFilters}
								className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
								Clear All
							</button>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 lg:ml-0">
					<div className="px-4 py-8 lg:px-8"
						style={
							{fontFamily: 'Fraunces'}
					}>
						{/* Loading State */}
						{
						loading && (
							<div className="py-16 text-center">
								<h2 className='text-2xl sm:text-3xl font-light tracking-wide'>Shirts By Category</h2>
								<div className="mt-8">Loading products...</div>
							</div>
						)
					}

						{/* Error State */}
						{
						error && !loading && (
							<div className="py-16 text-center">
								<h2 className='text-2xl sm:text-3xl font-light tracking-wide'>Shirts By Category</h2>
								<div className="mt-8 text-red-500">
									{error}</div>
								<button onClick={fetchProducts}
									className="mt-4 px-4 py-2 bg-black text-white rounded">
									Try Again
								</button>
							</div>
						)
					}

						{/* Content */}
						{
						!loading && !error && (
							<>
								<h2 className='text-2xl sm:text-3xl font-light tracking-wide text-center mb-8'>Shirts By Category</h2>

								{/* Filter buttons */}
								<div className="flex flex-wrap justify-center mt-4 gap-2 px-4 mb-12">
									<button className={
											`px-4 py-2 rounded-full text-sm ${
												activeFilter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
											}`
										}
										onClick={
											() => setActiveFilter('all')
									}>
										All Shirts
									</button>
									<button className={
											`px-4 py-2 rounded-full text-sm ${
												activeFilter === 'casual' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
											}`
										}
										onClick={
											() => setActiveFilter('casual')
									}>
										Casual
									</button>
									<button className={
											`px-4 py-2 rounded-full text-sm ${
												activeFilter === 'formal' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
											}`
										}
										onClick={
											() => setActiveFilter('formal')
									}>
										Formal
									</button>
									<button className={
											`px-4 py-2 rounded-full text-sm ${
												activeFilter === 'dress' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
											}`
										}
										onClick={
											() => setActiveFilter('dress')
									}>
										Dress
									</button>
									<button className={
											`px-4 py-2 rounded-full text-sm ${
												activeFilter === 'slim' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
											}`
										}
										onClick={
											() => setActiveFilter('slim')
									}>
										Slim Fit
									</button>
								</div>

								{/* Product Details Modal */}
								{
								showDetails && selectedProduct && (
									<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
										<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
											<div className="flex justify-end p-4">
												<button onClick={
														() => setShowDetails(false)
													}
													className="text-gray-500 hover:text-gray-700 text-xl">
													✕
												</button>
											</div>
											<div className="p-6 flex flex-col md:flex-row gap-6">
												<div className="md:w-1/2">
													<img src={
															`${imagepath}/${
																selectedProduct ?. images[0] ?. image_path || ''
															}`
														}
														alt={
															selectedProduct.name
														}
														className="w-full h-auto rounded-lg"
														onError={
															(e) => {
																e.target.src = '/images/placeholder-shirt.jpg';
															}
														}/>
												</div>
											<div className="md:w-1/2">
												<h2 className="text-2xl font-bold mb-2">
													{
													selectedProduct.name
												}</h2>
												<div className="flex items-center mb-4">
													<div className="flex text-sm">
														{
														renderRating(selectedProduct.rating)
													} </div>
													<span className="ml-2 text-gray-600">({
														selectedProduct.reviews_count
													}
														reviews)</span>
												</div>
												<div className="mb-4">
													<span className="text-2xl font-bold text-gray-900">${
														selectedProduct.price.toFixed(2)
													}</span>
													{
													selectedProduct.original_price && selectedProduct.on_sale && (
														<span className="text-lg text-gray-500 line-through ml-2">${
															selectedProduct.original_price.toFixed(2)
														}</span>
													)
												}
													{
													selectedProduct.on_sale && (
														<span className="ml-2 text-red-600 font-bold">
															{
															Math.round((1 - selectedProduct.price / selectedProduct.original_price) * 100)
														}% OFF
														</span>
													)
												} </div>
												<p className="mb-4 text-gray-700">
													{
													selectedProduct.description || `This is a detailed description of the ${
														selectedProduct.name
													}. It features high-quality materials and craftsmanship perfect for any occasion.`
												} </p>
												<div className="mb-4">
													<h3 className="font-semibold mb-2">Size</h3>
													<div className="flex gap-2">
														{
														selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (selectedProduct.sizes.map(size => (
															<button key={size}
																className="border border-gray-300 px-3 py-1 hover:bg-gray-100 rounded">
																{size} </button>
														))) : (
															<span className="text-gray-500">No sizes available</span>
														)
													} </div>
												</div>
												<div className="mb-4">
													<h3 className="font-semibold mb-2">Color</h3>
													<div className="flex gap-2">
														{
														selectedProduct.colors && selectedProduct.colors.length > 0 ? (selectedProduct.colors.map(color => (
															<button key={color}
																className="border border-gray-300 px-3 py-1 hover:bg-gray-100 rounded">
																{color} </button>
														))) : (
															<span className="text-gray-500">No colors available</span>
														)
													} </div>
												</div>
												<button className="w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors mb-2">
													Add to Cart
												</button>
												{/* <a href={
														`/view/${
															selectedProduct.slug || selectedProduct.id
														}`
													}
													className="block text-center text-gray-600 hover:text-gray-800 underline">
													View full details
												</a> */}
											</div>
										</div>
									</div>
								</div>
								)
							}

								{/* Products Grid */}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
									{
									filteredProducts.length > 0 ? (filteredProducts.map((product) => (
										<div key={
												product.id
											}
											className="relative group overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
											{/* Badges */}
											<div className="absolute top-2 left-2 z-10 flex gap-2">
												{
												product.is_new && (
													<span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
												)
											}
												{
												product.on_sale && (
													<span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
												)
											} </div>

											{/* Product Image */}
											<div className="w-full h-80 overflow-hidden cursor-pointer"
												onClick={
													() => handleProductSelect(product)
											}>
												<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
													src={
														`${imagepath}/${
															product ?. images[0] ?. image_path || ''
														}`
													}
													alt={
														product.name
													}
													onError={
														(e) => {
															e.target.src = '/images/placeholder-shirt.jpg';
														}
													}/>
											</div>

										{/* Product Info */}
										<div className="p-4">
											<a href={
													`/view/${
														product.slug || product.id
													}`
												}
												className="font-medium text-gray-800 mb-1 hover:text-blue-600 transition-colors block">
												<h3>{
													product.name
												}</h3>
											</a>

											{/* Rating */}
											<div className="flex items-center mb-2">
												<div className="flex text-sm">
													{
													renderRating(product.rating)
												} </div>
												<span className="text-xs text-gray-500 ml-1">({
													product.reviews_count
												})</span>
											</div>

											{/* Pricing */}
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<span className="text-lg font-bold text-gray-900">${
														product.price.toFixed(2)
													}</span>
													{
													product.original_price && product.on_sale && (
														<span className="text-sm text-gray-500 line-through ml-2">${
															product.original_price.toFixed(2)
														}</span>
													)
												} </div>

												{
												product.on_sale && (
													<span className="text-xs font-bold text-red-600">
														{
														Math.round((1 - product.price / product.original_price) * 100)
													}% OFF
													</span>
												)
											} </div>
										</div>
									</div>
									))) : (
										<div className="col-span-full text-center py-16">
											<p className="text-gray-600">No products found in this category.</p>
										</div>
									)
								} </div>
							</>
						)
					} </div>
				</div>
			</div>

			<Footer/>
		</>
	);
};

export default AllClothes;
