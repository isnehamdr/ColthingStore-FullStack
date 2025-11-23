import React, { useState, useEffect } from 'react';
// import CustomerForm from './CustomerForm';

const Customer = () => {
  // State for customers
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: '',
    status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock API functions (replace with actual API calls in production)
  const api = {
    // GET - Read all customers
    getCustomers: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data or data from localStorage
      const savedCustomers = localStorage.getItem('customers');
      return savedCustomers ? JSON.parse(savedCustomers) : [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, New York, NY 10001',
          totalOrders: 12,
          totalSpent: 845.99,
          lastOrderDate: '2023-11-15',
          status: 'active'
        },
        {
          id: 2,
          name: 'Michael Chen',
          email: 'michael.chen@example.com',
          phone: '+1 (555) 987-6543',
          address: '456 Oak Ave, Los Angeles, CA 90210',
          totalOrders: 8,
          totalSpent: 523.50,
          lastOrderDate: '2023-11-10',
          status: 'active'
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@example.com',
          phone: '+1 (555) 456-7890',
          address: '789 Pine Rd, Chicago, IL 60601',
          totalOrders: 15,
          totalSpent: 1234.75,
          lastOrderDate: '2023-11-05',
          status: 'vip'
        }
      ];
    },

    // POST - Create new customer
    createCustomer: async (customerData) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const savedCustomers = localStorage.getItem('customers');
      let customers = savedCustomers ? JSON.parse(savedCustomers) : [];
      
      // Generate new ID
      const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
      
      const newCustomer = {
        ...customerData,
        id: newId
      };
      
      customers.push(newCustomer);
      localStorage.setItem('customers', JSON.stringify(customers));
      
      return newCustomer;
    },

    // PUT - Update customer
    updateCustomer: async (id, customerData) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const savedCustomers = localStorage.getItem('customers');
      let customers = savedCustomers ? JSON.parse(savedCustomers) : [];
      
      const index = customers.findIndex(c => c.id === id);
      if (index !== -1) {
        customers[index] = { ...customers[index], ...customerData };
        localStorage.setItem('customers', JSON.stringify(customers));
        return customers[index];
      }
      
      throw new Error('Customer not found');
    },

    // DELETE - Remove customer
    deleteCustomer: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const savedCustomers = localStorage.getItem('customers');
      let customers = savedCustomers ? JSON.parse(savedCustomers) : [];
      
      customers = customers.filter(c => c.id !== id);
      localStorage.setItem('customers', JSON.stringify(customers));
      
      return { success: true };
    }
  };

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // Load customers from API
  const loadCustomers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isEditing) {
        // Update existing customer
        await api.updateCustomer(formData.id, formData);
        setCustomers(customers.map(c => 
          c.id === formData.id ? { ...c, ...formData } : c
        ));
      } else {
        // Create new customer
        const newCustomer = await api.createCustomer(formData);
        setCustomers([...customers, newCustomer]);
      }
      
      // Reset form
      resetForm();
      loadCustomers(); // Refresh the list
    } catch (err) {
      setError(isEditing ? 'Failed to update customer' : 'Failed to create customer');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit customer
  const handleEdit = (customer) => {
    setFormData({ ...customer });
    setIsEditing(true);
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setIsLoading(true);
      setError('');
      
      try {
        await api.deleteCustomer(id);
        setCustomers(customers.filter(c => c.id !== id));
      } catch (err) {
        setError('Failed to delete customer');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      email: '',
      phone: '',
      address: '',
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: '',
      status: 'active'
    });
    setIsEditing(false);
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-2">Manage your clothing store customers</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Customer Form Component */}
        {/* <CustomerForm 
          formData={formData}
          isEditing={isEditing}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        /> */}

        {/* Customer List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Customer List</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600">Loading customers...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="h-12 w-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-2 text-gray-600">No customers found</p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.totalOrders} orders</div>
                        {/* <div className="text-sm text-gray-500">${customer.totalSpent.toFixed(2)}</div> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination placeholder */}
          {filteredCustomers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredCustomers.length}</span> of <span className="font-medium">{customers.length}</span> customers
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 bg-blue-50 ">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customer;