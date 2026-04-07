import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    price: '',
    discount_price: '',
    is_sale: false,
    stock: '',
    images: [], // New images to upload
    imagePreviews: [], // Preview URLs for new images
    existingImages: [], // Existing images from server (with IDs)
    description: '',
    size: '',
    color: '',
    slug: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Function to generate slug from product name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Generate slug when product name changes
  useEffect(() => {
    if (formData.product_name && !initialData) {
      const newSlug = generateSlug(formData.product_name);
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }));
    }
  }, [formData.product_name, initialData]);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      const existingImages = initialData.images || [];
      setFormData({
        product_name: initialData.product_name || '',
        category: initialData.category || '',
        price: initialData.price || '',
        discount_price: initialData.discount_price || '',
        is_sale: !!initialData.is_sale,
        stock: initialData.stock || '',
        images: [],
        imagePreviews: [],
        existingImages: existingImages.map(img => ({
          id: img.id,
          image_path: img.image_path,
          is_primary: img.is_primary,
          url: `/storage/${img.image_path}`
        })),
        description: initialData.description || '',
        size: initialData.size || '',
        color: initialData.color || '',
        slug: initialData.slug || ''
      });
    } else {
      setFormData({
        product_name: '',
        category: '',
        price: '',
        discount_price: '',
        is_sale: false,
        stock: '',
        images: [],
        imagePreviews: [],
        existingImages: [],
        description: '',
        size: '',
        color: '',
        slug: ''
      });
    }
    setErrors({});
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.product_name) newErrors.product_name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (formData.discount_price && Number(formData.discount_price) > Number(formData.price)) {
      newErrors.discount_price = 'Discount price must be less than or equal to price';
    }
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.slug) newErrors.slug = 'Slug is required';
    
    // For new products, at least one image is required
    if (!initialData && formData.images.length === 0 && formData.existingImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    // Validate image types if images are selected
    if (formData.images.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
      const invalidFiles = formData.images.filter(file => !allowedTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        newErrors.images = 'All images must be JPEG, PNG, JPG, GIF, or SVG files';
      }
      
      // Validate file sizes (optional: limit to 5MB per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = formData.images.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        newErrors.images = 'Each image must be smaller than 5MB';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked
      }));

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else if (name === 'images' && files && files.length > 0) {
      const newFiles = Array.from(files);
      
      // Validate file types immediately
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
      const invalidFiles = newFiles.filter(file => !allowedTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        setErrors(prev => ({
          ...prev,
          images: 'All images must be JPEG, PNG, JPG, GIF, or SVG files'
        }));
        return;
      }
      
      // Create preview URLs for new images
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        imagePreviews: [...prev.imagePreviews, ...newPreviews]
      }));
      
      // Clear images error if validation passes
      setErrors(prev => ({ ...prev, images: '' }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when field is updated
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSlugChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      slug: generateSlug(value)
    }));
  };

  // Function to remove a new image (before upload)
  const removeNewImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const newPreviews = [...prev.imagePreviews];
      
      // Revoke the object URL to avoid memory leaks
      if (newPreviews[index] && newPreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      
      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews
      };
    });
  };

  // Function to remove an existing image (for edit mode)
 // Function to remove an existing image (for edit mode)
const removeExistingImage = async (imageId) => {
  if (!initialData) return;
  
  setLoading(true);
  try {
    // Use the correct route parameters - 'product' and 'image'
    const response = await axios.delete(
      route('ourproducts.images.destroy', { 
        id: initialData.id, 
        imageId: imageId 
      }), 
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      }
    );

    if (response.data.success) {
      // Remove the image from state
      setFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter(img => img.id !== imageId)
      }));
    } else {
      alert('Failed to delete image: ' + (response.data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    alert('Failed to delete image. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create FormData object for file upload
    const submitData = new FormData();
    submitData.append('product_name', formData.product_name);
    submitData.append('category', formData.category);
    submitData.append('price', formData.price);
    submitData.append('discount_price', formData.discount_price || '');
    submitData.append('is_sale', formData.is_sale ? '1' : '0');
    submitData.append('stock', formData.stock);
    submitData.append('description', formData.description);
    submitData.append('size', formData.size);
    submitData.append('color', formData.color);
    submitData.append('slug', formData.slug);
    
    // Append all new images
    formData.images.forEach((image, index) => {
      submitData.append(`images[${index}]`, image);
    });
    
    // If editing, include information about existing images to keep
    if (initialData && formData.existingImages.length > 0) {
      const existingImageIds = formData.existingImages.map(img => img.id);
      submitData.append('existing_images', JSON.stringify(existingImageIds));
    }
    
    onSubmit(submitData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.product_name ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.product_name && (
              <p className="mt-1 text-sm text-red-600">{errors.product_name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.slug ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              URL-friendly identifier (auto-generated from product name)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select Category</option>
              <option value="Pants">Pants</option>
              <option value="Shirts">Shirts</option>
              <option value="Jackets">Jackets</option>
              <option value="All">All</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (NPR)*
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Price (NPR)
            </label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.discount_price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.discount_price && (
              <p className="mt-1 text-sm text-red-600">{errors.discount_price}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              id="is_sale"
              type="checkbox"
              name="is_sale"
              checked={formData.is_sale}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_sale" className="text-sm font-medium text-gray-700">
              Show this product in sale section
            </label>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images {!initialData && '*'}
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/jpeg, image/png, image/jpg, image/gif, image/svg+xml"
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.images ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images}</p>
            )}
            
            {/* Existing Images */}
            {formData.existingImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Existing Images ({formData.existingImages.length} images)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {formData.existingImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img 
                        src={image.url} 
                        alt={`Product image ${index + 1}`} 
                        className="h-20 w-full object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {image.is_primary && (
                        <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        disabled={loading}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 disabled:opacity-50"
                        title="Delete image"
                      >
                        {loading ? '...' : '×'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Image Previews */}
            {formData.imagePreviews.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  New Images ({formData.imagePreviews.length} images selected)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {formData.imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="h-20 w-full object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: JPEG, PNG, JPG, GIF, SVG. You can select multiple images.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes (comma separated)
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="S, M, L, XL"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors (comma separated)
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Red, Blue, Green"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {initialData ? 'Update Product' : 'Add Product'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
