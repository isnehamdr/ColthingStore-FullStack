import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '@/Components/Product/ProductForm';
import AdminPageWrapper from '@/Components/Admin/AdminPageWrapper';

const Product = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const imagepath= import.meta.env.VITE_IMAGE_PATH

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(route('ourproducts.index'));
      
      // Check if response structure is correct
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddForm = () => {
    if (editingProduct) {
      setEditingProduct(null);
      setShowAddForm(false);
    } else {
      setShowAddForm(!showAddForm);
    }
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleAddProduct = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(route('ourproducts.store'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setProducts(prev => [...prev, response.data.data]);
        setShowAddForm(false);
        alert('Product added successfully!');
      } else {
        setError(response.data.message || 'Failed to add product');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add product. Please check your data and try again.';
      setError(errorMsg);
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (formData) => {
    if (!editingProduct || !editingProduct.id) {
      setError('No product selected for update');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      formData.append('_method', 'PUT');
      
      const response = await axios.post(route("ourproducts.update", {id: editingProduct.id}), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setProducts(prev => 
          prev.map(product => 
            product.id === editingProduct.id ? response.data.data : product
          )
        );
        
        setEditingProduct(null);
        setShowAddForm(false);
        alert('Product updated successfully!');
      } else {
        setError(response.data.message || 'Failed to update product');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update product. Please try again.';
      setError(errorMsg);
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete(route('ourproducts.destroy', { id: productId }));
      
      if (response.data.success) {
        setProducts(prev => prev.filter(product => product.id !== productId));
        alert('Product deleted successfully!');
      } else {
        setError(response.data.message || 'Failed to delete product');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete product. Please try again.';
      setError(errorMsg);
      console.error('Error deleting product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img 
                src={`${imagepath}/${product.images[0].image_path}`} 
                alt={product.product_name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                  e.target.className = 'h-full w-full object-contain bg-gray-100';
                }}
              />
            ) : (
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{product.product_name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.category}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-blue-600">${product.price}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                In Stock
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>Stock: {product.stock}</span>
              {product.size && <span>Sizes: {product.size}</span>}
            </div>
            <div className="flex gap-2 pt-3">
              <button
                onClick={() => handleEditProduct(product)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Table View Component
  const TableView = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.images && product.images.length > 0 ? (
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          src={`${imagepath}/${product.images[0].image_path}`} 
                          alt={product.product_name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                            e.target.className = 'h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                      {product.size && <div className="text-sm text-gray-500">Sizes: {product.size}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    In Stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <AdminPageWrapper>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Products Dashboard</h1>
            <p className="text-gray-600">Manage your clothing products</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex gap-2">
              <button
                onClick={toggleAddForm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {editingProduct ? 'Cancel Edit' : showAddForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7-4h14" />
                </svg>
              </button>
            </div>
          </div>

          {/* Add/Edit Product Form */}
          {showAddForm && (
            <ProductForm
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              initialData={editingProduct || null}
              onCancel={cancelEditing}
            />
          )}

          {/* Loading State */}
          {loading && !showAddForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="flex gap-2 pt-3">
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products List */}
          {!loading && products.length > 0 && !showAddForm && (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </div>
              {viewMode === 'grid' ? <GridView /> : <TableView />}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new product.</p>
              <div className="mt-6">
                <button
                  onClick={toggleAddForm}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default Product;