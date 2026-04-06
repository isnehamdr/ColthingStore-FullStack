import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import GuestLayout from '@/Layouts/GuestLayout';
import { CheckCircle, Shield, Truck, CreditCard, User, MapPin, Phone, Wallet } from 'lucide-react';
import { ShoppingCartIcon } from 'lucide-react';
import { XCircle } from 'lucide-react'; 
import emailjs from 'emailjs-com';
import axios from 'axios';

// Mock Order service
const SERVICE_ID = 'service_h3lobuf';
const TEMPLATE_ID = 'template_niyeu8x';
const PUBLIC_KEY = 'jvMR6xXskEv2MeFBg';

// eSewa Configuration
const ESEWA_CONFIG = {
  baseUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form', // Test URL
  statusUrl: 'https://rc.esewa.com.np/api/epay/transaction/status/', // Test status URL
  merchantCode: 'EPAYTEST', // Test merchant code
  successUrl: `${window.location.origin}/payment/success`,
  failureUrl: `${window.location.origin}/payment/failure`,
  environment: 'test',
  secretKey: '8gBm/:&EnhH.1/q' // Test secret key
};

async function sendOrderConfirmationEmail(order) {
  const templateParams = {
    order_number: order.order_number,
    email: order.email,
    year: new Date().getFullYear(),
    order_items: order.order_items.map(item => `
      <tr>
        <td>${item.product_name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
      </tr>
    `).join('')
  };

  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('✅ EmailJS Response:', res.status, res.text);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}

const OrderService = {
  async createOrder(orderData) {
    console.log('Order data:', orderData);

    const response = await axios.post(route('ourorders.store'), orderData);
    console.log(response.data)
    
    if(response.data.success){
        const order = response.data.data;
        await sendOrderConfirmationEmail(order);

        return {
          success: true,
          message: 'Order created and confirmation email sent successfully!',
          data: order
        };
    }
    
    return {
      success: true,
      data: {
        order_number: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        id: Math.floor(Math.random() * 1000)
      },
      message: 'Order created successfully'
    };
  },

  async updateOrderPaymentStatus(orderId, paymentData) {
    const response = await axios.put(`/api/orders/${orderId}/payment`, paymentData);
    return response.data;
  },

  // Verify eSewa payment status
  async verifyEsewaPayment(transactionData) {
    try {
      const response = await axios.get(ESEWA_CONFIG.statusUrl, {
        params: {
          product_code: ESEWA_CONFIG.merchantCode,
          total_amount: transactionData.total_amount,
          transaction_uuid: transactionData.transaction_uuid
        }
      });
      return response.data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error('Failed to verify payment status');
    }
  }
};

const CheckoutForm = () => {
  const { cart, cartCount, subtotal, grandTotal, clearCart, isLoaded } = useCart();

  // ── NEW: ref attached to the outermost wrapper so we can scroll to it
  const topRef = useRef(null);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'NP',
    phone: '',
    paymentMethod: 'esewa',
    saveInfo: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Calculate order totals
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // ── NEW: scroll to top whenever the step changes
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isLoaded && cart.length === 0 && !success) {
      console.log('Cart is empty');
    }
  }, [cart, isLoaded, success]);

  // Check for payment callback on component mount
  useEffect(() => {
    checkPaymentCallback();
  }, []);

  // Function to handle payment callback from eSewa
  const checkPaymentCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionData = urlParams.get('data');
    
    if (transactionData) {
      try {
        setPaymentProcessing(true);
        
        // Decode the base64 response from eSewa
        const decodedData = JSON.parse(atob(transactionData));
        console.log('eSewa callback data:', decodedData);

        // Verify payment status
        const verificationResult = await OrderService.verifyEsewaPayment({
          transaction_uuid: decodedData.transaction_uuid,
          total_amount: decodedData.total_amount
        });

        if (verificationResult.status === 'COMPLETE') {
          // Payment successful
          await handlePaymentSuccess(decodedData);
        } else {
          // Payment failed
          setError('Payment failed or was cancelled. Please try again.');
          setCurrentStep(2);
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setError('Error processing payment response. Please contact support.');
        setCurrentStep(2);
      } finally {
        setPaymentProcessing(false);
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (!formData.phone) errors.phone = 'Contact number is required';
    else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) errors.phone = 'Please enter a valid contact number';

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.postalCode) errors.postalCode = 'Postal code is required';
    if (!formData.country) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      const formattedValue = value.replace(/\D/g, '').substring(0, 15);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Generate HMAC SHA256 signature for eSewa
  const generateSignature = async (message, secret) => {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        messageData
      );
      const hashArray = Array.from(new Uint8Array(signature));
      const hashBase64 = btoa(String.fromCharCode(...hashArray));

      return hashBase64;
    } catch (error) {
      console.error("Signature generation error:", error);
      throw new Error("Failed to generate payment signature");
    }
  };

  // eSewa Payment Integration - IMPROVED
  const processEsewaPayment = async (order) => {
    setPaymentProcessing(true);
    
    try {
      // Generate unique transaction UUID
      const transactionUuid = `TXN-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase()}`;

      const paymentData = {
        amount: subtotal.toFixed(2),
        tax_amount: tax.toFixed(2),
        total_amount: total.toFixed(2),
        transaction_uuid: transactionUuid,
        product_code: ESEWA_CONFIG.merchantCode,
        product_service_charge: '0',
        product_delivery_charge: shipping.toFixed(2),
        success_url: ESEWA_CONFIG.successUrl,
        failure_url: ESEWA_CONFIG.failureUrl,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
      };

      // Generate signature
      const message = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
      const signature = await generateSignature(message, ESEWA_CONFIG.secretKey);
      paymentData.signature = signature;

      console.log('eSewa Payment Data:', paymentData);

      // Store order details in sessionStorage for retrieval after payment
      const orderData = {
        transactionUuid,
        orderItems: cart.map(item => ({
          id: item.productId,
          product_id: item.productId,
          product_name: item.title || item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '/api/placeholder/150/150',
          seller_id: item.sellerId,
          seller_name: item.sellerName
        })),
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        amounts: {
          subtotal,
          shipping,
          tax,
          total,
        },
        timestamp: new Date().toISOString(),
      };
      sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));

      // Create and submit form to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = ESEWA_CONFIG.baseUrl;
      form.style.display = 'none';

      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      
      // Clear cart after successful payment initialization
      clearCart();
      form.submit();

    } catch (error) {
      console.error('eSewa payment error:', error);
      setError('Failed to initialize payment. Please try again.');
      setPaymentProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setLoading(true);

    try {
      // Base order data
      const orderData = {
        email: formData.email,
        phone: formData.phone,
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        payment_method: formData.paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: 'pending',
        cart_items: cart.map(item => ({
          id: item.productId,
          name: item.title || item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '/api/placeholder/150/150',
          seller_id: item.sellerId,
          seller_name: item.sellerName
        }))
      };

      console.log('Submitting order data:', orderData);

      const response = await OrderService.createOrder(orderData);
      
      if (response.success) {
        const order = response.data;
        setCreatedOrder(order);
        setOrderNumber(order.order_number);
        
        // Move to payment step
        setCurrentStep(2);
        
      } else {
        throw new Error(response.message || 'Failed to place order');
      }

    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle payment submission (step 2)
  const handlePaymentSubmit = async () => {
    setPaymentProcessing(true);
    setError('');

    try {
      await processEsewaPayment(createdOrder);
    } catch (error) {
      console.error('Payment submission error:', error);
      setError('Failed to process payment. Please try again.');
      setPaymentProcessing(false);
    }
  };

  // Payment Success Handler
  const handlePaymentSuccess = async (paymentData) => {
    try {
      console.log('Payment successful:', paymentData);
      
      if (createdOrder) {
        await OrderService.updateOrderPaymentStatus(createdOrder.id, {
          ...paymentData,
          status: 'confirmed',
          payment_status: 'completed',
          transaction_id: paymentData.transaction_code || paymentData.ref_id
        });
      }

      setSuccess(`Order confirmed successfully! Your order number is: ${orderNumber}`);
      clearCart();
      setCurrentStep(3);
      await sendConfirmationMessage();
    } catch (error) {
      console.error('Payment success handling error:', error);
      setError('Order confirmed but failed to update status. Please contact support.');
    }
  };

  // Send confirmation message
  const sendConfirmationMessage = async () => {
    try {
      if (formData.phone) {
        console.log(`SMS sent to ${formData.phone}: Your order ${orderNumber} has been confirmed.`);
        // In production, integrate with SMS service like SMS API, Twilio, etc.
      }

      if (formData.email) {
        console.log(`Confirmation email sent to ${formData.email}`);
      }
    } catch (error) {
      console.error('Failed to send confirmation message:', error);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: Truck },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Confirmation', icon: CheckCircle }
  ];

  // Render payment method section - only eSewa
  const renderPaymentMethodSection = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
        Payment Method
      </h2>
      
      <div className="space-y-4">
        {/* eSewa Option - Only Option */}
        <div className="flex items-center bg-green-50 p-4 rounded-lg border border-green-200">
          <input
            id="esewa"
            name="paymentMethod"
            type="radio"
            value="esewa"
            checked={formData.paymentMethod === 'esewa'}
            onChange={handleInputChange}
            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
          />
          <label htmlFor="esewa" className="ml-3 block text-sm font-medium text-gray-700 flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-green-600" />
            eSewa Digital Wallet
          </label>
        </div>

        {/* eSewa Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <h3 className="text-sm font-semibold text-green-800 mb-2">eSewa Payment Instructions:</h3>
          <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
            <li>You will be redirected to eSewa payment gateway</li>
            <li>Complete the payment using your eSewa account</li>
            <li>You'll be redirected back after successful payment</li>
            <li>Confirmation message will be sent to your phone and email</li>
            <li className="font-semibold">Currently using TEST environment for payments</li>
            <li>Use eSewa test credentials for payment</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Render step 1 - Shipping Information
  const renderShippingStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Contact Information
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              required
            />
            {formErrors.email && (
              <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="98XXXXXXXX"
              required
            />
            {formErrors.phone && (
              <p className="mt-2 text-sm text-red-600">{formErrors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Shipping Address
        </h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                formErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.firstName && (
              <p className="mt-2 text-sm text-red-600">{formErrors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                formErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.lastName && (
              <p className="mt-2 text-sm text-red-600">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Street address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="123 Main St"
            required
          />
          {formErrors.address && (
            <p className="mt-2 text-sm text-red-600">{formErrors.address}</p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                formErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.city && (
              <p className="mt-2 text-sm text-red-600">{formErrors.city}</p>
            )}
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP / Postal code *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                formErrors.postalCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.postalCode && (
              <p className="mt-2 text-sm text-red-600">{formErrors.postalCode}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              formErrors.country ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            required
          >
            <option value="NP">Nepal</option>
          </select>
          {formErrors.country && (
            <p className="mt-2 text-sm text-red-600">{formErrors.country}</p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      {renderPaymentMethodSection()}

      {/* Save Information */}
      <div className="flex items-center p-4 bg-blue-50 rounded-xl">
        <input
          id="saveInfo"
          name="saveInfo"
          type="checkbox"
          checked={formData.saveInfo}
          onChange={handleInputChange}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="saveInfo" className="ml-3 block text-sm text-gray-900">
          Save this information for next time
        </label>
      </div>

      {/* Continue to Payment Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-black text-white border border-transparent rounded-lg shadow-sm py-4 px-4 text-base font-semibold text-white hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing...
          </div>
        ) : (
          `Continue to Payment - $${total.toFixed(2)}`
        )}
      </button>
    </form>
  );

  // Render step 2 - Payment
  const renderPaymentStep = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Payment Information
      </h2>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Your payment is secure and encrypted through eSewa. You will be redirected to eSewa's secure payment gateway.
        </p>
      </div>

      <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center">
        <div className="h-16 w-full mx-auto mb-4 flex items-center justify-center bg-white rounded shadow-sm">
          <span className="text-3xl font-bold text-green-600">
            eSewa
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Pay with eSewa
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Nepal's most trusted digital payment solution
        </p>
        <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
          <p className="text-sm text-gray-600 mb-1">
            Total Amount
          </p>
          <p className="text-3xl font-bold text-green-600">
            $ {total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal
          </span>
          <span className="font-semibold text-gray-900">
            $ {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            Shipping
          </span>
          <span className="font-semibold text-gray-900">
            $ {shipping.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            Tax (8% VAT)
          </span>
          <span className="font-semibold text-gray-900">
            $ {tax.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          disabled={paymentProcessing}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handlePaymentSubmit}
          disabled={paymentProcessing}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paymentProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              Pay with eSewa
              <CreditCard className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <GuestLayout>
      {/* ── ref attached here so scrollIntoView targets the very top of the page content */}
      <div ref={topRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : isCurrent 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg transform scale-110'
                            : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <span className={`mt-2 text-sm font-medium hidden sm:block ${
                        isCurrent ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="max-w-3xl mx-auto mb-6 p-6 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Order Confirmed!</h3>
              <p className="mb-4">{success}</p>
              <p className="text-sm mb-4">Confirmation message has been sent to your phone and email.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="/orders" 
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Orders
                </a>
                <a 
                  href="/" 
                  className="bg-white text-green-600 border border-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          )}

          {!success && (
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
              {/* Left Column - Form */}
              <div className="lg:col-span-1">
                {currentStep === 1 && renderShippingStep()}
                {currentStep === 2 && renderPaymentStep()}
              </div>

              {/* Right Column - Order Summary */}
              <div className="mt-8 lg:mt-0 lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  
                  {/* Cart Items */}
                  <div className="flow-root mb-6">
                    <ul className="-my-4 divide-y divide-gray-200">
                      {cart.map((item) => (
                        <li key={item.productId} className="py-4 flex items-center">
                          <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={item.image || '/api/placeholder/150/150'}
                              alt={item.title || item.name}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3 className="text-sm">{item.title || item.name}</h3>
                                <p className="ml-4 text-sm">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                              </div>
                              {item.sellerName && (
                                <p className="text-xs text-gray-500 mt-1">Sold by: {item.sellerName}</p>
                              )}
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <p className="text-gray-500">Qty {item.quantity || 1}</p>
                              <p className="text-gray-600">${(item.price || 0).toFixed(2)} each</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Shipping</p>
                      <p>${shipping.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Tax</p>
                      <p>${tax.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4">
                      <p>Total</p>
                      <p>${total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  {/* Continue Shopping */}
                  <a 
                    href="/"
                    className="block w-full text-center mt-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GuestLayout>
  );
};

export default CheckoutForm;