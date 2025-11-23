import React from 'react';
import { usePage } from '@inertiajs/react';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
  const { props } = usePage();
  const { order_id } = props;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-4">
          We couldn't process your payment. Please try again.
        </p>
        {order_id && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {order_id}
          </p>
        )}
        <div className="space-y-3">
          <a
            href={window.history.length > 2 ? 'javascript:history.back()' : '/'}
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Try Again
          </a>
          <a
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;