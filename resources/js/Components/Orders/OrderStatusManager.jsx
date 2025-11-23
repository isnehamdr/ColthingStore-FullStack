// OrderStatusManager.jsx
import React, { useState } from 'react';
import axios from 'axios';

const OrderStatusManager = ({ order, isAdmin, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);

  const statusOptions = [
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  const handleStatusUpdate = async () => {
    if (!isAdmin) return;

    try {
      setIsUpdating(true);
      const response = await axios.put(`/admin/orders/${order.id}`, {
        status: newStatus
      });

      if (response.data.success) {
        onStatusUpdate(response.data.data);
        alert('Order status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
        {order.status.toUpperCase()}
      </span>
      
      {isAdmin && (
        <div className="flex items-center gap-2">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
            disabled={isUpdating}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.toUpperCase()}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleStatusUpdate}
            disabled={isUpdating || newStatus === order.status}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderStatusManager;