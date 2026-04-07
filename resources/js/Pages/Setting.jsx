import React, {useState, useEffect} from 'react';
import {usePage, router} from '@inertiajs/react';
import {
	FiShoppingCart,
	FiX,
	FiMenu,
	FiUser,
	FiLock,
	FiSave,
	FiUpload
} from 'react-icons/fi';

// ✅ Inline SVG fallback — no external file needed, never 404s

// const IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH || 'http://127.0.0.1:8000/storage';

const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f3f4f6'/><circle cx='50' cy='38' r='20' fill='%236b7280'/><ellipse cx='50' cy='82' rx='30' ry='18' fill='%236b7280'/></svg>`;

const getImageUrl = (imagePath) => {
	if (!imagePath || typeof imagePath !== 'string') return DEFAULT_AVATAR;
	const value = imagePath.trim();
	if (!value) return DEFAULT_AVATAR;
	if (
		value.startsWith('http://') ||
		value.startsWith('https://') ||
		value.startsWith('blob:') ||
		value.startsWith('data:')
	) {
		return value;
	}
	if (value.startsWith('/storage/') || value.startsWith('/images/')) {
		return value;
	}
	if (value.startsWith('storage/') || value.startsWith('images/')) {
		return `/${value}`;
	}
	return `/storage/${value.replace(/^\/+/, '')}`;
};

const getUserImage = (user) => getImageUrl(user?.image || user?.avatar);

const Setting = () => {
	const {auth} = usePage().props;
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [activeSection, setActiveSection] = useState('profile');
	const [loading, setLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	const [message, setMessage] = useState('');

	const [profile, setProfile] = useState({
		name: auth.user?.name || '',
		email: auth.user?.email || '',
		phone_number: auth.user?.phone_number || '',
		address: auth.user?.address || ''
	});

	const [security, setSecurity] = useState({
		current_password: '',
		new_password: '',
		new_password_confirmation: ''
	});

	const [selectedImage, setSelectedImage] = useState(null);
	// ✅ Initialize imagePreview correctly from auth.user.image
	const [imagePreview, setImagePreview] = useState(() => getUserImage(auth.user));

	// ✅ Update preview when auth.user.image changes (e.g. after successful upload + page reload)
	useEffect(() => {
		setImagePreview(getUserImage(auth.user));
	}, [auth.user]);

	// Sync profile fields when auth.user changes
	useEffect(() => {
		if (auth.user) {
			setProfile({
				name: auth.user.name || '',
				email: auth.user.email || '',
				phone_number: auth.user.phone_number || '',
				address: auth.user.address || ''
			});
		}
	}, [auth.user]);

	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (!file.type.startsWith('image/')) {
				setMessage('Error: Please select a valid image file');
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				setMessage('Error: Image size should be less than 5MB');
				return;
			}
			setSelectedImage(file);
			// Show local preview immediately
			const reader = new FileReader();
			reader.onload = (e) => setImagePreview(e.target.result);
			reader.readAsDataURL(file);
		}
	};

	const handleImageUpload = async () => {
		if (!selectedImage) {
			setMessage('Please select an image first');
			return;
		}
		setImageLoading(true);
		setMessage('');

		const formData = new FormData();
		formData.append('image', selectedImage);
		formData.append('_method', 'put');

		try {
			await router.post(route('users.update', {id: auth.user.id}), formData, {
				preserveScroll: true,
				headers: {'Content-Type': 'multipart/form-data'},
				onSuccess: (page) => {
					setMessage('Profile image updated successfully!');
					setSelectedImage(null);
					// ✅ After upload, use the updated auth.user.image from the new page props
					setImagePreview(getUserImage(page.props.auth?.user));
					setTimeout(() => setMessage(''), 3000);
				},
				onError: (errors) => {
					if (errors && typeof errors === 'object') {
						setMessage(`Error: ${Object.values(errors).flat().join(', ')}`);
					} else {
						setMessage('Error updating profile image. Please try again.');
					}
					// ✅ Revert preview back to saved image on error
					setImagePreview(getUserImage(auth.user));
				},
				onFinish: () => setImageLoading(false)
			});
		} catch (error) {
			setMessage('Error uploading image. Please try again.');
			setImageLoading(false);
		}
	};

	const handleProfileSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		router.put(route('users.update', {id: auth.user.id}), profile, {
			preserveScroll: true,
			onSuccess: () => {
				setMessage('Profile updated successfully!');
				setTimeout(() => setMessage(''), 3000);
			},
			onError: (errors) => {
				if (errors && typeof errors === 'object') {
					setMessage(`Error: ${Object.values(errors).flat().join(', ')}`);
				} else {
					setMessage('Error updating profile. Please check your inputs.');
				}
			},
			onFinish: () => setLoading(false)
		});
	};

	const handleSecuritySubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		if (security.new_password !== security.new_password_confirmation) {
			setMessage('New passwords do not match!');
			setLoading(false);
			return;
		}

		router.put(route('users.update', {id: auth.user.id}), security, {
			preserveScroll: true,
			onSuccess: () => {
				setMessage('Password updated successfully!');
				setSecurity({current_password: '', new_password: '', new_password_confirmation: ''});
				setTimeout(() => setMessage(''), 3000);
			},
			onError: (errors) => {
				if (errors && typeof errors === 'object') {
					setMessage(`Error: ${Object.values(errors).flat().join(', ')}`);
				} else {
					setMessage('Error updating password. Please try again.');
				}
			},
			onFinish: () => setLoading(false)
		});
	};

	const handleProfileChange = (field, value) => setProfile(prev => ({...prev, [field]: value}));
	const handleSecurityChange = (field, value) => setSecurity(prev => ({...prev, [field]: value}));

	const settingsMenu = [{
		category: 'account',
		label: 'Account',
		items: [
			{id: 'profile', label: 'Profile', icon: FiUser},
			{id: 'security', label: 'Security', icon: FiLock},
		]
	}];

	const ProfileContent = () => (
		<form onSubmit={handleProfileSubmit}>
			<h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Settings</h2>

			{message && !message.includes('Password') && !message.includes('image') && (
				<div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
					<div className="flex items-center">
						{message.includes('Error') ? <FiX className="h-5 w-5 mr-2"/> : <FiSave className="h-5 w-5 mr-2"/>}
						{message}
					</div>
				</div>
			)}

			<div className="space-y-6">
				{/* Image Upload Section */}
				<div className="flex items-center space-x-4">
					<div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
						<img
							src={imagePreview}
							alt="Profile"
							className="w-full h-full object-cover"
							onError={(e) => {
								e.target.onerror = null; // prevent infinite loop
								e.target.src = DEFAULT_AVATAR;
							}}
						/>
					</div>
					<div className="space-y-2">
						<div className="flex space-x-2">
							<label htmlFor="image-upload" className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
								<FiUpload className="inline mr-1"/>
								Choose Photo
							</label>
							<input id="image-upload" type="file" accept="image/*" onChange={handleImageSelect} className="hidden"/>
							{selectedImage && (
								<button type="button" onClick={handleImageUpload} disabled={imageLoading}
									className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
									{imageLoading
										? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>Uploading...</>
										: <><FiSave className="inline mr-1"/>Upload</>
									}
								</button>
							)}
						</div>
						{selectedImage && <p className="text-xs text-gray-500">Selected: {selectedImage.name}</p>}
					</div>
				</div>

				{/* Image upload message */}
				{message && (message.includes('image') || message.includes('Image')) && (
					<div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
						<div className="flex items-center text-sm">
							{message.includes('Error') ? <FiX className="h-4 w-4 mr-2"/> : <FiSave className="h-4 w-4 mr-2"/>}
							{message}
						</div>
					</div>
				)}

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
					<input type="text" value={profile.name} onChange={(e) => handleProfileChange('name', e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
					<input type="email" value={profile.email} onChange={(e) => handleProfileChange('email', e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
					<input type="text" value={profile.phone_number} onChange={(e) => handleProfileChange('phone_number', e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
					<input type="text" value={profile.address} onChange={(e) => handleProfileChange('address', e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"/>
				</div>

				<button type="submit" disabled={loading}
					className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center transition-colors">
					{loading
						? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Saving...</>
						: <><FiSave className="mr-2"/>Save Changes</>
					}
				</button>
			</div>
		</form>
	);

	const SecurityContent = () => (
		<form onSubmit={handleSecuritySubmit}>
			<h2 className="text-2xl font-semibold text-gray-800 mb-6">Security Settings</h2>

			{message && (
				<div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
					<div className="flex items-center">
						{message.includes('Error') ? <FiX className="h-5 w-5 mr-2"/> : <FiSave className="h-5 w-5 mr-2"/>}
						{message}
					</div>
				</div>
			)}

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
					<input type="password" value={security.current_password} onChange={(e) => handleSecurityChange('current_password', e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors" required/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
					<input type="password" value={security.new_password} onChange={(e) => handleSecurityChange('new_password', e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors" required minLength={8}/>
					<p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
					<input type="password" value={security.new_password_confirmation} onChange={(e) => handleSecurityChange('new_password_confirmation', e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors" required minLength={8}/>
				</div>

				<button type="submit" disabled={loading}
					className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center transition-colors">
					{loading
						? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Updating...</>
						: <><FiSave className="mr-2"/>Update Password</>
					}
				</button>
			</div>
		</form>
	);

	const SettingsContent = () => {
		const contentMap = {profile: <ProfileContent/>, security: <SecurityContent/>};
		return contentMap[activeSection] || <ProfileContent/>;
	};

	return (
		<div className="flex h-screen bg-gray-50">
			{sidebarOpen && (
				<div className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}/>
			)}

			{/* Settings Sidebar */}
			<div className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				<div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
					<a href="/dashboard">
						<div className="flex items-center">
							<FiShoppingCart className="h-6 w-6 text-indigo-600"/>
							<span className="ml-2 text-lg font-semibold text-gray-800">Settings</span>
						</div>
					</a>
					<button onClick={() => setSidebarOpen(false)} className="lg:hidden">
						<FiX className="h-5 w-5 text-gray-500"/>
					</button>
				</div>

				<nav className="flex-1 overflow-y-auto py-6">
					{settingsMenu.map((section) => (
						<div key={section.category} className="mb-6">
							<div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								{section.label}
							</div>
							<div className="mt-2 space-y-1">
								{section.items.map((item) => (
									<button key={item.id} onClick={() => setActiveSection(item.id)}
										className={`flex items-center w-full px-6 py-2.5 text-sm transition-colors ${activeSection === item.id ? 'text-indigo-600 bg-indigo-50 border-r-2 border-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}>
										<item.icon className="h-4 w-4 mr-3"/>
										{item.label}
									</button>
								))}
							</div>
						</div>
					))}
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="bg-white border-b border-gray-200">
					<div className="flex items-center px-6 py-4">
						<button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
							<FiMenu className="h-6 w-6 text-gray-500"/>
						</button>
						<div className="flex-1">
							<h1 className="text-xl font-semibold text-gray-800">Settings</h1>
							<p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
						</div>
						<div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
							<span className="text-white text-sm font-medium">
								{auth.user?.name?.charAt(0) || 'U'}
							</span>
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-3xl mx-auto">
						<SettingsContent/>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Setting;
