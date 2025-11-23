import React, { useEffect, useState } from 'react';
import { CheckCircle, ShoppingBag, Mail, Phone, Download, Home, ShoppingCart, X } from 'lucide-react';
import Navbar from '@/Components/ClothingStore/Navbar';
import Footer from '@/Components/ClothingStore/Footer';
import { Link } from '@inertiajs/react';

const PaymentSuccess = ({ setShowForm, showForm }) => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve order data from sessionStorage
        const storedOrder = sessionStorage.getItem('pendingOrder');
        if (storedOrder) {
            const order = JSON.parse(storedOrder);
            setOrderData(order);
            // Clear the pending order from sessionStorage
            sessionStorage.removeItem('pendingOrder');
        }
        setLoading(false);
    }, []);

    const handleClose = () => {
        setShowForm(false);
    };

    const handleContinueShopping = () => {
        setShowForm(false);
        window.location.href = '/';
    };

    const handleViewOrders = () => {
        setShowForm(false);
        window.location.href = '/orders';
    };

    const generateInvoiceHTML = () => {
        const invoiceDate = new Date();
        const formattedDate = invoiceDate.toLocaleDateString();
        const formattedTime = invoiceDate.toLocaleTimeString();

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${orderData?.transactionUuid || 'Order'}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        .invoice-header {
            text-align: center;
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .invoice-title {
            color: #10b981;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        .invoice-subtitle {
            color: #6b7280;
            font-size: 16px;
            margin: 5px 0;
        }
        .company-info {
            text-align: left;
            margin-bottom: 30px;
        }
        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background-color: #f9fafb;
            padding: 10px 15px;
            border-left: 4px solid #10b981;
            font-weight: bold;
            color: #374151;
            margin-bottom: 15px;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
        }
        .info-item {
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: 600;
            color: #6b7280;
            font-size: 14px;
        }
        .info-value {
            color: #1f2937;
            font-size: 14px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .items-table th {
            background-color: #f3f4f6;
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .totals-table {
            width: 300px;
            margin-left: auto;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 8px 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .totals-table tr:last-child td {
            border-bottom: none;
            font-weight: bold;
            font-size: 16px;
            color: #10b981;
        }
        .thank-you {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background-color: #f0fdf4;
            border-radius: 8px;
            border: 1px solid #bbf7d0;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #d1fae5;
            color: #065f46;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="invoice-header">
        <h1 class="invoice-title">INVOICE</h1>
        <p class="invoice-subtitle">Thank you for your purchase</p>
    </div>

    <div class="company-info">
        <div class="company-name">FashionStore</div>
        <div>123 Fashion Street, Kathmandu, Nepal</div>
        <div>Email: support@fashionstore.com | Phone: +977-1-4567890</div>
    </div>

    <div class="grid-2">
        <div class="section">
            <div class="section-title">Bill To</div>
            <div class="info-item">
                <div class="info-label">Customer Name</div>
                <div class="info-value">${orderData?.customerInfo?.firstName} ${orderData?.customerInfo?.lastName}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${orderData?.customerInfo?.email}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Phone</div>
                <div class="info-value">${orderData?.customerInfo?.phone}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Shipping Address</div>
                <div class="info-value">
                    ${orderData?.customerInfo?.address}
                    ${orderData?.customerInfo?.apartment ? `, ${orderData.customerInfo.apartment}` : ''}<br>
                    ${orderData?.customerInfo?.city}, ${orderData?.customerInfo?.postalCode}<br>
                    ${orderData?.customerInfo?.country}
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Invoice Details</div>
            <div class="info-item">
                <div class="info-label">Invoice Number</div>
                <div class="info-value">${orderData?.transactionUuid || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Invoice Date</div>
                <div class="info-value">${formattedDate}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Invoice Time</div>
                <div class="info-value">${formattedTime}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Payment Method</div>
                <div class="info-value">eSewa</div>
            </div>
            <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value"><span class="status-badge">PAID</span></div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Order Items</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderData?.orderItems?.map(item => `
                    <tr>
                        <td>${item.product_name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>${item.quantity}</td>
                        <td class="text-right">$${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                `).join('') || ''}
            </tbody>
        </table>
    </div>

    <div class="section">
        <table class="totals-table">
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">$${orderData?.amounts?.subtotal?.toFixed(2) || '0.00'}</td>
            </tr>
            <tr>
                <td>Shipping:</td>
                <td class="text-right">$${orderData?.amounts?.shipping?.toFixed(2) || '0.00'}</td>
            </tr>
            <tr>
                <td>Tax:</td>
                <td class="text-right">$${orderData?.amounts?.tax?.toFixed(2) || '0.00'}</td>
            </tr>
            <tr>
                <td><strong>Total:</strong></td>
                <td class="text-right"><strong>$${orderData?.amounts?.total?.toFixed(2) || '0.00'}</strong></td>
            </tr>
        </table>
    </div>

    <div class="thank-you">
        <h3>Thank you for your business!</h3>
        <p>Your order has been confirmed and will be shipped within 3-5 business days.</p>
        <p>If you have any questions, please contact our support team at support@fashionstore.com</p>
    </div>

    <div class="footer">
        <p>This is an computer-generated invoice. No signature is required.</p>
        <p>FashionStore &copy; ${new Date().getFullYear()} - All rights reserved</p>
    </div>
</body>
</html>
        `;
    };

    const downloadReceipt = () => {
        if (!orderData) return;

        try {
            // Generate the invoice HTML content
            const invoiceContent = generateInvoiceHTML();
            
            // Create a Blob with the HTML content
            const blob = new Blob([invoiceContent], { 
                type: 'text/html' 
            });
            
            // Create a download URL for the Blob
            const url = URL.createObjectURL(blob);
            
            // Create a temporary anchor element to trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${orderData.transactionUuid || 'order'}.html`;
            
            // Append to body, click, and remove
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up the URL object
            URL.revokeObjectURL(url);
            
            // Optional: Also provide a PDF alternative (commented out as it requires additional libraries)
            // generatePDFInvoice();
            
        } catch (error) {
            console.error('Error generating invoice:', error);
            // Fallback to simple text receipt
            downloadTextReceipt();
        }
    };

    // Fallback function for text receipt
    const downloadTextReceipt = () => {
        const receiptText = `
PAYMENT RECEIPT
================================

FashionStore
123 Fashion Street
Kathmandu, Nepal
Email: support@fashionstore.com
Phone: +977-1-4567890

INVOICE DETAILS:
----------------
Invoice Number: ${orderData?.transactionUuid || 'N/A'}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
Payment Method: eSewa
Status: PAID

CUSTOMER INFORMATION:
---------------------
Name: ${orderData?.customerInfo?.firstName} ${orderData?.customerInfo?.lastName}
Email: ${orderData?.customerInfo?.email}
Phone: ${orderData?.customerInfo?.phone}
Address: ${orderData?.customerInfo?.address}
${orderData?.customerInfo?.apartment ? `Apartment: ${orderData.customerInfo.apartment}` : ''}
City: ${orderData?.customerInfo?.city}
Postal Code: ${orderData?.customerInfo?.postalCode}
Country: ${orderData?.customerInfo?.country}

ORDER ITEMS:
------------
${orderData?.orderItems?.map(item => `
• ${item.product_name}
  Quantity: ${item.quantity}
  Price: $${item.price.toFixed(2)}
  Subtotal: $${(item.quantity * item.price).toFixed(2)}
`).join('')}

ORDER SUMMARY:
--------------
Subtotal: $${orderData?.amounts?.subtotal?.toFixed(2) || '0.00'}
Shipping: $${orderData?.amounts?.shipping?.toFixed(2) || '0.00'}
Tax: $${orderData?.amounts?.tax?.toFixed(2) || '0.00'}
TOTAL: $${orderData?.amounts?.total?.toFixed(2) || '0.00'}

Thank you for your purchase!
Your order will be shipped within 3-5 business days.

For any inquiries, please contact:
support@fashionstore.com
+977-1-4567890

This is an computer-generated receipt.
No signature is required.
        `.trim();

        const blob = new Blob([receiptText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${orderData?.transactionUuid || 'order'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading order details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            
            {/* Success Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto relative">
                    {/* Close Button */}
                    <Link href={'/'}
                        className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </Link>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-t-2xl text-white text-center">
                        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-green-100 text-lg">
                            Thank you for your purchase
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
                                Order Summary
                            </h2>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Order ID:</span>
                                    <span className="font-mono font-semibold text-gray-900">
                                        {orderData?.transactionUuid || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Date & Time:</span>
                                    <span className="text-gray-900">
                                        {new Date().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="text-gray-900 flex items-center">
                                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-1">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </span>
                                        eSewa
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Items Ordered:</h3>
                                <div className="space-y-2">
                                    {orderData?.orderItems?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                                <p className="text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="text-gray-900">${orderData?.amounts?.subtotal?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="text-gray-900">${orderData?.amounts?.shipping?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax:</span>
                                        <span className="text-gray-900">${orderData?.amounts?.tax?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                                        <span className="text-gray-900">Total:</span>
                                        <span className="text-green-600">${orderData?.amounts?.total?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Mail className="w-5 h-5 mr-2 text-green-600" />
                                Customer Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Name</p>
                                    <p className="font-semibold text-gray-900">
                                        {orderData?.customerInfo?.firstName} {orderData?.customerInfo?.lastName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Email</p>
                                    <p className="font-semibold text-gray-900">
                                        {orderData?.customerInfo?.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Phone</p>
                                    <p className="font-semibold text-gray-900 flex items-center">
                                        <Phone className="w-4 h-4 mr-1" />
                                        {orderData?.customerInfo?.phone}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-gray-600">Shipping Address</p>
                                    <p className="font-semibold text-gray-900">
                                        {orderData?.customerInfo?.address}
                                        {orderData?.customerInfo?.apartment && `, ${orderData.customerInfo.apartment}`}
                                        <br />
                                        {orderData?.customerInfo?.city}, {orderData?.customerInfo?.postalCode}
                                        <br />
                                        {orderData?.customerInfo?.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Message */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-green-800 font-semibold">
                                        Order confirmed! 
                                    </p>
                                    <p className="text-green-700 text-sm mt-1">
                                        A confirmation email has been sent to {orderData?.customerInfo?.email}. 
                                        You will receive your order within 3-5 business days.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={downloadReceipt}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Invoice
                            </button>
                          
                            {/* <a href="/order">
                                <button
                                    onClick={handleViewOrders}
                                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    View Orders
                                </button>
                            </a> */}
                            <a href="/">
                                <button
                                    onClick={handleContinueShopping}
                                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Home className="w-5 h-5" />
                                    Continue Shopping
                                </button>
                            </a>
                        </div>

                        {/* Support Info */}
                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Need help? Contact our support team at{" "}
                                <a href="mailto:support@example.com" className="text-green-600 hover:underline">
                                    support@example.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PaymentSuccess;