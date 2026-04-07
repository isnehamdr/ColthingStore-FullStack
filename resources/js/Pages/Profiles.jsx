import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  User,
  Package,
  Settings,
  Edit2,
  Save,
  X,
  Camera,
  ShoppingBagIcon,
  Trash2,
  Calendar,
  MapPin,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";
import Navbar from "@/Components/ClothingStore/Navbar";
import Footer from "@/Components/ClothingStore/Footer";
import { usePage, router } from "@inertiajs/react";
import { useCart } from '../contexts/CartContext';

const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f3f4f6'/><circle cx='50' cy='38' r='20' fill='%236b7280'/><ellipse cx='50' cy='82' rx='30' ry='18' fill='%236b7280'/></svg>`;
const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' fill='%23f3f4f6'/><rect x='24' y='22' width='72' height='76' rx='8' fill='%23d1d5db'/><path d='M36 84l18-20 14 14 16-22 12 28H36z' fill='%239ca3af'/></svg>`;

const getImageUrl = (imagePath, fallback = DEFAULT_AVATAR) => {
  if (!imagePath || typeof imagePath !== "string") return fallback;
  const value = imagePath.trim();
  if (!value) return fallback;
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }
  if (value.startsWith("/storage/") || value.startsWith("/images/")) {
    return value;
  }
  if (value.startsWith("storage/") || value.startsWith("images/")) {
    return `/${value}`;
  }
  return `/storage/${value.replace(/^\/+/, "")}`;
};

const getUserImage = (user) => getImageUrl(user?.image || user?.avatar, DEFAULT_AVATAR);

const Profiles = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_AVATAR);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false
  });
  const fileInputRef = useRef(null);

  // Use CartContext
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    grandTotal, 
    shippingTotal,
    isLoaded 
  } = useCart();

  const { auth } = usePage().props;
  const currentUser = auth.user;

  useEffect(() => {
    setUserData(currentUser || null);
    setEditData(currentUser || {});
    setImagePreview(getUserImage(currentUser));
    setLoading(false);
  }, [currentUser]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === "orders" && currentUser?.id) {
        setOrdersLoading(true);
        try {
          const response = await axios.get(route("ourorders.index"));
          setOrders(response.data.data || []);
        } catch (error) {
          console.error("Error fetching orders:", error);
          alert("Failed to load orders");
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab, currentUser?.id]);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Start editing
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...userData });
    setSelectedImage(null);
    setImagePreview(getUserImage(userData));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle input change
  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Save updated data
  const handleSave = () => {
    if (!currentUser?.id) {
      alert("User not authenticated");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", editData.name || "");
    formData.append("email", editData.email || "");
    formData.append("address", editData.address || "");
    formData.append("phone_number", editData.phone_number || "");
    
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    router.post(route("users.update", { id: currentUser.id }), formData, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: (page) => {
        const updatedUser = page.props.auth?.user ?? {
          ...userData,
          ...editData,
        };

        setUserData(updatedUser);
        setEditData(updatedUser);
        setImagePreview(getUserImage(updatedUser));
        setIsEditing(false);
        setSelectedImage(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        alert("Profile updated successfully!");
      },
      onError: (errors) => {
        console.error("Error updating profile:", errors);
        const errorMessage =
          (errors && Object.values(errors).flat().join(", ")) ||
          "Failed to update profile";
        setImagePreview(getUserImage(userData));
        alert(errorMessage);
      },
      onFinish: () => {
        setSaving(false);
      },
    });
  };

  // Delete user
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

    if (!currentUser?.id) {
      alert("User not authenticated");
      return;
    }

    try {
      await axios.delete(route("users.destroy", { id: currentUser.id }));
      alert("Account deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete account";
      alert(errorMessage);
    }
  };

  // Handle notification settings change
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Save notification settings
  const saveNotificationSettings = async () => {
    try {
      await axios.put(route("users.update", { id: currentUser.id }), {
        notification_settings: notificationSettings
      });
      
      alert("Notification settings updated successfully!");
    } catch (error) {
      console.error("Error updating notification settings:", error);
      alert("Failed to update notification settings");
    }
  };

  // Handle change password
  const handleChangePassword = () => {
    const newPassword = prompt("Enter your new password:");
    if (newPassword) {
      if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
      }
      
      const confirmPassword = prompt("Confirm your new password:");
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // Call API to change password
      axios.put(route("users.update", { id: currentUser.id }), {
        password: newPassword,
        password_confirmation: confirmPassword
      })
      .then(() => {
        alert("Password changed successfully!");
      })
      .catch(error => {
        console.error("Error changing password:", error);
        alert("Failed to change password");
      });
    }
  };

  // Handle two-factor authentication
  const handleTwoFactorAuth = () => {
    alert("Two-factor authentication feature would be implemented here. This would typically involve:\n\n1. Sending a verification code to your email/phone\n2. Setting up authenticator app\n3. Backup codes generation");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!userData) return <p className="text-center py-10 text-red-600">User not found.</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "Fraunces" }}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-gray-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />

                  {/* Camera Icon */}
                  {isEditing && (
                    <>
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-1 -right-1 bg-black text-white p-1.5 rounded-full hover:bg-gray-800 transition"
                        type="button"
                      >
                        <Camera className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-3xl font-light text-gray-900 truncate">{userData.name}</h1>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Joined on {new Date(userData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 md:px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base flex-1 md:flex-none justify-center"
                    type="button"
                  >
                    <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 md:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base flex-1 md:flex-none justify-center"
                    type="button"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base flex-1 md:flex-none justify-center ${
                      saving 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                    type="button"
                  >
                    <Save className="w-3 h-3 md:w-4 md:h-4" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 md:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm md:text-base flex-1 md:flex-none justify-center"
                    type="button"
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-4 md:gap-8 min-w-max">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "orders", label: "Orders", icon: Package },
                { id: "cart", label: "Cart", icon: ShoppingBagIcon },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 md:py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  type="button"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 md:py-8 overflow-hidden">
          {activeTab === "overview" && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-hidden">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Profile Overview</h2>

              {isEditing ? (
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editData.phone_number || ""}
                      onChange={(e) => handleChange("phone_number", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editData.address || ""}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 md:py-3 border-b border-gray-100 gap-1">
                    <strong className="w-32 text-gray-600 text-sm md:text-base">Email:</strong>
                    <span className="break-words">{userData.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 md:py-3 border-b border-gray-100 gap-1">
                    <strong className="w-32 text-gray-600 text-sm md:text-base">Phone:</strong>
                    <span>{userData.phone_number || "Not provided"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 md:py-3 gap-1">
                    <strong className="w-32 text-gray-600 text-sm md:text-base">Address:</strong>
                    <span className="break-words">{userData.address || "Not provided"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-hidden">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Order History</h2>

              {ordersLoading ? (
                <div className="text-center py-8">
                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6 overflow-hidden">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 md:p-6 overflow-hidden">
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base md:text-lg truncate">{order.order_number}</h3>
                          <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 mt-1 md:mt-0">
                          <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          </span>
                          <span className="font-semibold text-sm md:text-base">{formatCurrency(order.total)}</span>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium">Shipping Address</p>
                            <p className="text-gray-600 break-words">
                              {order.first_name} {order.last_name}<br />
                              {order.address}{order.apartment && `, ${order.apartment}`}<br />
                              {order.city}, {order.postal_code}<br />
                              {order.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CreditCard className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium">Payment Method</p>
                            <p className="text-gray-600 break-words">
                              Card ending in {order.card_last_four}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-gray-200 pt-3 md:pt-4">
                        <h4 className="font-medium mb-2 md:mb-3 text-sm md:text-base">Order Items</h4>
                        <div className="space-y-2 md:space-y-3">
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 md:gap-4">
                              <img
                                src={getImageUrl(item.image, DEFAULT_PRODUCT_IMAGE)}
                                alt={item.product_name}
                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = DEFAULT_PRODUCT_IMAGE;
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm md:text-base truncate">{item.product_name}</p>
                                <p className="text-xs md:text-sm text-gray-600">
                                  Quantity: {item.quantity} × {formatCurrency(item.price)}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-medium text-sm md:text-base">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="border-t border-gray-200 pt-3 md:pt-4 mt-3 md:mt-4">
                        <div className="flex justify-between text-xs md:text-sm">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span>Shipping:</span>
                          <span>{formatCurrency(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t border-gray-200 mt-2 pt-2 text-sm md:text-base">
                          <span>Total:</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "cart" && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-hidden">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Shopping Cart</h2>
              
              {!isLoaded ? (
                <div className="text-center py-8">
                  <p>Loading cart...</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  {/* Cart Items */}
                  <div className="lg:col-span-2">
                    <div className="space-y-3 md:space-y-4">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-gray-200 rounded-lg">
                          <img
                            src={getImageUrl(item.image, DEFAULT_PRODUCT_IMAGE)}
                            alt={item.title || item.name}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_PRODUCT_IMAGE;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base md:text-lg truncate">{item.title || item.name}</h3>
                            <p className="text-gray-600 text-sm md:text-base">{formatCurrency(item.price || 0)}</p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 md:gap-3 mt-2">
                              <button
                                onClick={() => updateQuantity(item.productId, (item.quantity || 1) - 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                                disabled={(item.quantity || 1) <= 1}
                              >
                                <Minus className="w-3 h-3 md:w-4 md:h-4"/>
                              </button>
                              
                              <span className="w-6 md:w-8 text-center font-medium text-sm md:text-base">
                                {item.quantity || 1}
                              </span>
                              
                              <button
                                onClick={() => updateQuantity(item.productId, (item.quantity || 1) + 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-base md:text-lg">
                              {formatCurrency((item.price || 0) * (item.quantity || 1))}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-600 hover:text-red-800 mt-1 md:mt-2"
                            >
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Clear Cart Button */}
                    <div className="mt-4 md:mt-6">
                      <button
                        onClick={clearCart}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base w-full md:w-auto"
                      >
                        Clear Entire Cart
                      </button>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-4 md:p-6 sticky top-4">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Order Summary</h3>
                      
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex justify-between text-sm md:text-base">
                          <span>Subtotal</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm md:text-base">
                          <span>Shipping</span>
                          <span>{formatCurrency(shippingTotal)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base md:text-lg border-t border-gray-200 pt-2 md:pt-3">
                          <span>Total</span>
                          <span>{formatCurrency(grandTotal)}</span>
                        </div>
                      </div>
                      <a href="/checkout" className="block">
                        <button className="w-full mt-4 md:mt-6 bg-black text-white py-2 md:py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base">
                          Proceed to Checkout
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl bg-white rounded-lg border border-gray-200 p-4 md:p-6 mx-auto overflow-hidden">
              <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-4 md:mb-6">Account Settings</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 md:mb-3">Privacy & Security</h3>
                  <div className="space-y-2 md:space-y-3">
                    <button 
                      onClick={handleChangePassword}
                      className="w-full flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 text-sm md:text-base">Change Password</span>
                      <span className="text-gray-400">→</span>
                    </button>
                    <button 
                      onClick={handleTwoFactorAuth}
                      className="w-full flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 text-sm md:text-base">Two-Factor Authentication</span>
                      <span className="text-gray-400">→</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 md:mb-3">Notifications</h3>
                  <div className="space-y-2 md:space-y-3">
                    <label className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-gray-700 text-sm md:text-base">Email Notifications</span>
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                        className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-black focus:ring-black" 
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-gray-700 text-sm md:text-base">Order Updates</span>
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.orderUpdates}
                        onChange={() => handleNotificationChange('orderUpdates')}
                        className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-black focus:ring-black" 
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-gray-700 text-sm md:text-base">Promotional Emails</span>
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.promotionalEmails}
                        onChange={() => handleNotificationChange('promotionalEmails')}
                        className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-black focus:ring-black" 
                      />
                    </label>
                  </div>
                  
                  {/* Save Notification Settings Button */}
                  <button
                    onClick={saveNotificationSettings}
                    className="mt-3 md:mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base w-full md:w-auto"
                  >
                    Save Notification Settings
                  </button>
                </div>

                <div className="pt-4 md:pt-6 border-t border-gray-200">
                  <button 
                    onClick={handleDelete}
                    className="w-full px-4 py-2 md:py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm md:text-base"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profiles;
