// components/Navbar.js
import React, {useState, useEffect, useRef} from 'react';
import {
	Menu,
	Minus,
	Plus,
	ShoppingCartIcon,
	Trash2,
	User,
	X,
	Search,
	LogOut,
	LogIn,
	LayoutDashboard
} from 'lucide-react';
import {useCart} from '../../contexts/CartContext';
import {Link, usePage, router} from '@inertiajs/react';

const Navbar = ({onMenuClick}) => {
	const [isHidden, setIsHidden] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showUserDropdown, setShowUserDropdown] = useState(false);

	// Use CartContext
	const {
		cart,
		removeFromCart,
		updateQuantity,
		clearCart,
		cartCount,
		subtotal,
		grandTotal,
		groupedCart
	} = useCart();

	const dropdownRef = useRef(null);
	const mobileMenuRef = useRef(null);
	const userDropdownRef = useRef(null);
	const userTriggerRef = useRef(null);
	const searchInputRef = useRef(null);
	const cartContainerRef = useRef(null);

	const {auth} = usePage().props;
	const isLoggedIn = !!auth.user;

	// Hide navbar on scroll
	const controlNavbar = () => {
		if (typeof window !== 'undefined') {
			if (window.scrollY > lastScrollY && window.scrollY > 100) {
				setIsHidden(true);
			} else {
				setIsHidden(false);
			}
			setLastScrollY(window.scrollY);
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', controlNavbar, {passive: true});
			return() => {
				window.removeEventListener('scroll', controlNavbar);
			};
		}
	}, [lastScrollY]);

	// Close dropdowns when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			// Close user dropdown when clicking outside
			if (userDropdownRef.current && 
				!userDropdownRef.current.contains(event.target) && 
				userTriggerRef.current && 
				!userTriggerRef.current.contains(event.target)) {
				setShowUserDropdown(false);
			}

			// Close mobile menu when clicking outside
			if (mobileMenuRef.current && 
				!mobileMenuRef.current.contains(event.target) && 
				!event.target.closest('.mobile-menu-button')) {
				setIsMobileMenuOpen(false);
			}

			// Close cart when clicking outside
			if (isCartOpen && 
				cartContainerRef.current && 
				!cartContainerRef.current.contains(event.target) && 
				!event.target.closest('.cart-trigger')) {
				closeCart();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return() => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isCartOpen]);

	// Focus search input when search is opened
	useEffect(() => {
		if (isSearchOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isSearchOpen]);

	// Handle escape key to close search and cart
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				if (isSearchOpen) {
					closeSearch();
				}
				if (isCartOpen) {
					closeCart();
				}
				if (showUserDropdown) {
					setShowUserDropdown(false);
				}
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isSearchOpen, isCartOpen, showUserDropdown]);

	// Prevent body scroll when cart or search is open
	useEffect(() => {
		if (isCartOpen || isSearchOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isCartOpen, isSearchOpen]);

	// Auth handlers
	const handleSignIn = () => {
		router.visit(route('login'));
	};

	const handleLogout = () => {
        axios
            .post(route("logout"))
            .then((response) => {
                if (response.data.redirect) {
                    window.location.href = response.data.redirect;
                } else {
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.error("Logout error:", error);
                window.location.href = "/login";
            });
    };

	// Checkout handler with authentication check
	const handleCheckout = () => {
		if (!isLoggedIn) {
			// Store current cart state and intended checkout path
			if (cart.length > 0) {
				localStorage.setItem('intended_checkout', '/checkout');
				// Optionally store cart data to restore after login if needed
				localStorage.setItem('pre_login_cart', JSON.stringify(cart));
			}
			
			// Redirect to login page with a message
			router.visit(route('login'), {
				data: {
					message: 'Please log in to proceed with checkout'
				}
			});
			closeCart();
			return;
		}
		
		// User is logged in, proceed to checkout
		router.visit('/checkout');
		closeCart();
	};

	// Search handler
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			// Redirect to search results page with query parameter
			router.visit(route('search', { q: searchQuery.trim() }));
			closeSearch();
		}
	};

	// Quick search suggestions (optional)
	const quickSearch = (term) => {
		setSearchQuery(term);
		// Auto-submit after setting query
		setTimeout(() => {
			router.visit(route('search', { q: term }));
			closeSearch();
		}, 100);
	};

	// UI handlers
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		if (onMenuClick) onMenuClick();
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const toggleCart = () => {
		setIsCartOpen(!isCartOpen);
	};

	const closeCart = () => {
		setIsCartOpen(false);
	};

	const toggleUserDropdown = () => {
		setShowUserDropdown(!showUserDropdown);
	};

	const closeUserDropdown = () => {
		setShowUserDropdown(false);
	};

	const openSearch = () => {
		setIsSearchOpen(true);
		setSearchQuery('');
	};

	const closeSearch = () => {
		setIsSearchOpen(false);
		setSearchQuery('');
	};

	// Cart item handlers
	const handleRemoveItem = (productId) => {
		removeFromCart(productId);
	};

	const handleUpdateQuantity = (productId, newQuantity) => {
		if (newQuantity < 1) return;
		updateQuantity(productId, newQuantity);
	};

	const handleClearCart = () => {
		clearCart();
	};

	return (
		<>
			<div className={
					`fixed w-full bg-white border-b border-gray-200 transition-transform duration-300 z-50 ${
						isHidden ? '-translate-y-full' : 'translate-y-0'
					}`
				}
				style={
					{fontFamily: 'Fraunces'}
			}>
				<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
					<div className="flex justify-between items-center py-3 sm:py-4 lg:py-6">
						{/* Logo */}
						<div className="flex-shrink-0">
							<Link href="/home">
								<h2 className='text-lg sm:text-xl text-gray-800 uppercase leading-6 tracking-widest font-light'>
									Roon
									<span className='font-bold text-gray-900'>
										apparel</span>
								</h2>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center gap-8 xl:gap-16">
							<nav className="flex space-x-6 xl:space-x-8">
								<Link href="/home" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-gray-900 whitespace-nowrap text-sm xl:text-base">
									Home
								</Link>
								<Link href="/shirt" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-gray-900 whitespace-nowrap text-sm xl:text-base">
									Shirts
								</Link>
								<Link href="/pant" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-gray-900 whitespace-nowrap text-sm xl:text-base">
									Pants
								</Link>
								<Link href="/jacket" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-gray-900 whitespace-nowrap text-sm xl:text-base">
									Jackets
								</Link>
								<Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-gray-900 whitespace-nowrap text-sm xl:text-base">
									Contact
								</Link>
							</nav>

							<div className="flex items-center gap-4">
								{/* Search Button */}
								<button 
									onClick={openSearch}
									className="search-trigger flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
									aria-label="Search products"
								>
									<Search className="w-5 h-5"/>
								</button>

								{/* User Dropdown */}
								<div className="relative" ref={userDropdownRef}>
									<button 
										ref={userTriggerRef}
										className="user-avatar flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
										onClick={toggleUserDropdown}
										aria-label="User menu"
										aria-expanded={showUserDropdown}
									>
										<User className="w-5 h-5"/>
									</button>

									{/* Dropdown menu */}
									{showUserDropdown && (
										<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
											<div className="py-1">
												{isLoggedIn ? (
													<>
														<div className="px-4 py-2 text-xs text-gray-500 border-b">
															Welcome back!
														</div>
														<Link 
															href={'/profiles'} 
															className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
															onClick={closeUserDropdown}
														>
															<User className="w-4 h-4 mr-2"/>
															Profile
														</Link>
														<Link 
															href="/dashboard" 
															className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
															onClick={closeUserDropdown}
														>
															<LayoutDashboard className="w-4 h-4 mr-2"/>
															Dashboard
														</Link>
														<button 
															onClick={() => {
																handleLogout();
																closeUserDropdown();
															}}
															className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														>
															<LogOut className="w-4 h-4 mr-2"/>
															Sign out
														</button>
													</>
												) : (
													<button 
														onClick={() => {
															handleSignIn();
															closeUserDropdown();
														}}
														className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														<LogIn className="w-4 h-4 mr-2"/>
														Sign in
													</button>
												)}
											</div>
										</div>
									)}
								</div>

								{/* Cart trigger button */}
								<button 
									onClick={toggleCart}
									className="cart-trigger flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 relative"
									aria-label={`Shopping cart with ${cartCount} items`}
								>
									<ShoppingCartIcon className="w-5 h-5"/>
									{cartCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{cartCount}
										</span>
									)}
								</button>
							</div>
						</div>

						{/* Mobile Navigation */}
						<div className="flex items-center gap-2 lg:hidden">
							<div className="flex items-center gap-1">
								<button 
									onClick={openSearch}
									className="search-trigger text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
									aria-label="Search products"
								>
									<Search className="w-4 h-4 sm:w-5 sm:h-5"/>
								</button>

								{/* Mobile User - Direct link to login if not authenticated */}
								{/* {isLoggedIn ? (
									<div className="relative">
										<button 
											onClick={toggleUserDropdown}
											className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
											aria-label="User menu"
										>
											<User className="w-4 h-4 sm:w-5 sm:h-5"/>
										</button>
										{showUserDropdown && (
											<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
												<div className="py-1">
													<div className="px-4 py-2 text-xs text-gray-500 border-b">
														Welcome back!
													</div>
													<Link 
														href="/profiles" 
														className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
														onClick={() => {
															closeUserDropdown();
															closeMobileMenu();
														}}
													>
														<User className="w-4 h-4 sm:w-5 sm:h-5 mr-3"/>
														Profile
													</Link>
													<Link 
														href="/store" 
														className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
														onClick={() => {
															closeUserDropdown();
															closeMobileMenu();
														}}
													>
														<LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 mr-3"/>
														Dashboard
													</Link>
													<button 
														onClick={() => {
															handleLogout();
															closeUserDropdown();
															closeMobileMenu();
														}}
														className="flex items-center w-full text-left text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
													>
														<LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-3"/>
														Sign out
													</button>
												</div>
											</div>
										)}
									</div>
								) : (
									<button 
										onClick={handleSignIn}
										className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
										aria-label="Sign in"
									>
										<User className="w-4 h-4 sm:w-5 sm:h-5"/>
									</button>
								)} */}

								{/* Mobile cart trigger button */}
								<button 
									onClick={toggleCart}
									className="cart-trigger text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 relative"
									aria-label={`Shopping cart with ${cartCount} items`}
								>
									<ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
									{cartCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
											{cartCount}
										</span>
									)}
								</button>
							</div>

							{/* Mobile Menu Button */}
							<button 
								className="mobile-menu-button p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
								onClick={toggleMobileMenu}
								aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
								aria-expanded={isMobileMenuOpen}
							>
								{isMobileMenuOpen ? <X size={18} className="sm:w-5 sm:h-5"/> : <Menu size={18} className="sm:w-5 sm:h-5"/>}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile menu items - FULL WHITE BACKGROUND */}
				<div 
					ref={mobileMenuRef}
					className={`lg:hidden border-t border-gray-200 transition-all duration-300 bg-white absolute top-full left-0 right-0 shadow-lg ${
						isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
					}`}
				>
					<div className="py-3 px-3 sm:px-4 lg:px-8 bg-white">
						<nav className="grid grid-cols-1 gap-1 bg-white">
							<Link 
								href="/home" 
								className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
								onClick={closeMobileMenu}
							>
								Home
							</Link>
							<Link 
								href="/shirt" 
								className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
								onClick={closeMobileMenu}
							>
								Shirts
							</Link>
							<Link 
								href="/pant" 
								className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
								onClick={closeMobileMenu}
							>
								Pants
							</Link>
							<Link 
								href="/jacket" 
								className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
								onClick={closeMobileMenu}
							>
								Jackets
							</Link>
							<Link 
								href="/contact" 
								className="text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
								onClick={closeMobileMenu}
							>
								Contact
							</Link>

							{/* Mobile Auth Section */}
							<div className="border-t border-gray-200 mt-2 pt-3 bg-white">
								{isLoggedIn ? (
									<div className="space-y-1 bg-white">
										<Link 
											href="/profiles" 
											className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
											onClick={closeMobileMenu}
										>
											<User className="w-4 h-4 sm:w-5 sm:h-5 mr-3"/>
											Profile
										</Link>
										<Link 
											href="/store" 
											className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
											onClick={closeMobileMenu}
										>
											<LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 mr-3"/>
											Dashboard
										</Link>
										<button 
											onClick={() => {
												handleLogout();
												closeMobileMenu();
											}}
											className="flex items-center w-full text-left text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
										>
											<LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-3"/>
											Sign out
										</button>
									</div>
								) : (
									<button 
										onClick={() => {
											handleSignIn();
											closeMobileMenu();
										}}
										className="flex items-center w-full text-left text-gray-700 hover:text-gray-900 transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-50 text-base font-medium bg-white"
									>
										<LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-3"/>
										Sign in
									</button>
								)}
							</div>
						</nav>
					</div>
				</div>
			</div>

			{/* Spacer to prevent content from being hidden behind fixed navbar */}
			<div className="h-14 sm:h-16 lg:h-20"></div>

			{/* Full Page Search Modal */}
			{isSearchOpen && (
				<div className="fixed inset-0 z-[60] bg-white">
					{/* Search Header */}
					<div className="border-b border-gray-200">
						<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
							<div className="flex items-center justify-between py-3 sm:py-4">
								<div className="flex-shrink-0">
									<h2 className='text-lg sm:text-xl text-gray-800 uppercase leading-6 tracking-widest font-light'>
										Roon
										<span className='font-bold text-gray-900'>apparel</span>
									</h2>
								</div>
								<button 
									onClick={closeSearch}
									className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
									aria-label="Close search"
								>
									<X size={20} className="sm:w-6 sm:h-6 text-gray-600"/>
								</button>
							</div>
						</div>
					</div>

					{/* Search Content */}
					<div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
						<form onSubmit={handleSearch} className="mb-6 sm:mb-8">
							<div className="relative">
								<input 
									ref={searchInputRef}
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="What are you looking for?"
									className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-14 sm:pr-16 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-black focus:border-black text-base sm:text-lg"
									autoFocus
								/>
								<button 
									type="submit" 
									className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black p-1 sm:p-2"
									aria-label="Search"
								>
									<Search className="w-5 h-5 sm:w-6 sm:h-6"/>
								</button>
							</div>
						</form>

						{/* Quick Search Suggestions */}
						<div className="space-y-4 sm:space-y-6">
							<div>
								<h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
									Popular Searches
								</h3>
								<div className="flex flex-wrap gap-2 sm:gap-3">
									{['T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Shorts', 'Dresses'].map((term) => (
										<button 
											key={term}
											type="button"
											onClick={() => quickSearch(term.toLowerCase())}
											className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm sm:text-base font-medium"
										>
											{term}
										</button>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
									Categories
								</h3>
								<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
									{[
										{ name: 'Shirts', href: '/shirt' },
										{ name: 'Pants', href: '/pant' },
										{ name: 'Jackets', href: '/jacket' },
										{ name: 'Accessories', href: '/accessories' },
										{ name: 'Sale', href: '/sale' },
										{ name: 'New Arrivals', href: '/new' }
									].map((category) => (
										<Link
											key={category.name}
											href={category.href}
											onClick={closeSearch}
											className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-center"
										>
											<span className="text-gray-800 font-medium text-sm sm:text-base">{category.name}</span>
										</Link>
									))}
								</div>
							</div>

							{/* Recent Searches (optional - you can implement this with localStorage) */}
							<div>
								<h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
									Trending Now
								</h3>
								<div className="flex flex-wrap gap-2">
									{['Summer Collection', 'Limited Edition', 'Organic Cotton', 'Vintage Style', 'Athletic Wear'].map((term) => (
										<button 
											key={term}
											type="button"
											onClick={() => quickSearch(term.toLowerCase())}
											className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-full transition-colors duration-200 text-xs sm:text-sm"
										>
											{term}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Cart Overlay */}
			{isCartOpen && (
				<div className="fixed inset-0 z-50 overflow-hidden">
					{/* Backdrop */}
					<div 
						className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
						onClick={closeCart}
					/>
					{/* Off-Canvas Cart */}
					<div 
						ref={cartContainerRef}
						className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl transform transition-transform"
					>
						{/* Cart Header */}
						<div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200">
							<h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
								Shopping Cart ({cartCount})
							</h2>
							<button 
								onClick={closeCart}
								className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
								aria-label="Close cart"
							>
								<X size={18} className="sm:w-5 sm:h-5 text-gray-600"/>
							</button>
						</div>

						{/* Cart Content */}
						<div className="flex flex-col h-full">
							<CartContent 
								cart={cart}
								groupedCart={groupedCart}
								subtotal={subtotal}
								grandTotal={grandTotal}
								onUpdateQuantity={handleUpdateQuantity}
								onRemoveItem={handleRemoveItem}
								onClearCart={handleClearCart}
								onClose={closeCart}
								onCheckout={handleCheckout}
								isLoggedIn={isLoggedIn}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

// Updated Cart Content Component with authentication check
const CartContent = ({
	cart,
	groupedCart,
	subtotal,
	grandTotal,
	onUpdateQuantity,
	onRemoveItem,
	onClearCart,
	onClose,
	onCheckout,
	isLoggedIn
}) => {
	return (
		<>
			{cart.length === 0 ? (
				<div className="flex-1 flex items-center justify-center p-4 sm:p-6">
					<div className="text-center">
						<ShoppingCartIcon size={40} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4"/>
						<p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">Your cart is empty</p>
						<button 
							onClick={onClose}
							className="px-4 sm:px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
						>
							Continue Shopping
						</button>
					</div>
				</div>
			) : (
				<>
					{/* Cart Items */}
					<div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
						<div className="space-y-3 sm:space-y-4 lg:space-y-6">
							{Object.values(groupedCart).map((group) => (
								<div key={group.sellerId} className="space-y-2 sm:space-y-3 lg:space-y-4">
									<h3 className="text-xs sm:text-sm font-medium text-gray-700 border-b pb-1 sm:pb-2">
										Seller: {group.sellerName}
									</h3>
									{group.items.map((item) => (
										<div 
											key={item.productId}
											className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 bg-gray-50 p-2 sm:p-3 lg:p-4 rounded-lg"
										>
											{/* Product Image */}
											<div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
												{item.image ? (
													<img 
														src={item.image}
														alt={item.title}
														className="w-full h-full object-cover"
													/>
												) : (
													<ShoppingCartIcon size={16} className="sm:w-5 sm:h-5 text-gray-400"/>
												)}
											</div>

											{/* Product Details */}
											<div className="flex-1 min-w-0">
												<h3 className="text-xs sm:text-sm font-medium text-gray-800 truncate">
													{item.title}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600">
													${item.price?.toFixed(2)}
												</p>

												{/* Quantity Controls */}
												<div className="flex items-center space-x-1 sm:space-x-2 mt-1 sm:mt-2">
													<button 
														onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
														className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
														disabled={item.quantity <= 1}
														aria-label="Decrease quantity"
													>
														<Minus size={12} className="sm:w-3.5 sm:h-3.5 text-gray-600"/>
													</button>
													<span className="px-2 sm:px-3 py-1 bg-white border rounded text-xs sm:text-sm font-medium min-w-8 sm:min-w-10 lg:min-w-12 text-center">
														{item.quantity}
													</span>
													<button 
														onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
														className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
														aria-label="Increase quantity"
													>
														<Plus size={12} className="sm:w-3.5 sm:h-3.5 text-gray-600"/>
													</button>
												</div>
											</div>

											{/* Item Total & Remove Button */}
											<div className="text-right flex-shrink-0">
												<p className="text-xs sm:text-sm font-semibold text-gray-800">
													${(item.price * item.quantity).toFixed(2)}
												</p>
												<button 
													onClick={() => onRemoveItem(item.productId)}
													className="mt-1 sm:mt-2 p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
													aria-label="Remove item"
												>
													<Trash2 size={12} className="sm:w-3.5 sm:h-3.5 text-red-500"/>
												</button>
											</div>
										</div>
									))}
								</div>
							))}
						</div>

						{/* Clear All Button */}
						{cart.length > 0 && (
							<button 
								onClick={onClearCart}
								className="w-full mt-3 sm:mt-4 lg:mt-6 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium"
							>
								Clear All Items
							</button>
						)}
					</div>

					{/* Cart Footer */}
					<div className="border-t border-gray-200 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 lg:space-y-4">
						{/* Totals */}
						<div className="space-y-1 sm:space-y-2">
							<div className="flex justify-between items-center text-sm sm:text-base">
								<span className="text-gray-600">Subtotal:</span>
								<span className="font-medium">${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between items-center text-xs sm:text-sm">
								<span className="text-gray-600">Shipping:</span>
								<span className="text-gray-500">Calculated at checkout</span>
							</div>
							<div className="flex justify-between items-center pt-2 border-t border-gray-200 text-base sm:text-lg">
								<span className="font-semibold text-gray-800">Total:</span>
								<span className="font-bold text-gray-900">${grandTotal.toFixed(2)}</span>
							</div>
						</div>

						{/* Checkout Buttons */}
						<div className="space-y-2">
							<button 
								onClick={onCheckout}
								className="w-full bg-black hover:bg-gray-800 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base mb-1 sm:mb-2"
							>
								{isLoggedIn ? 'Proceed to Checkout' : 'Sign In to Checkout'}
							</button>
							<button 
								onClick={onClose}
								className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
							>
								Continue Shopping
							</button>
						</div>

						{/* Message for non-logged in users */}
						{!isLoggedIn && cart.length > 0 && (
							<div className="text-center">
								<p className="text-xs text-gray-500">
									Please sign in to complete your purchase
								</p>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;