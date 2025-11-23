<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4CAF50;
            margin: 0;
        }
        .order-number {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
        .order-number strong {
            color: #4CAF50;
            font-size: 18px;
        }
        .section {
            margin: 30px 0;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 14px;
        }
        .info-value {
            color: #333;
            font-size: 14px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .items-table th {
            background-color: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #dee2e6;
        }
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }
        .item-row {
            vertical-align: top;
        }
        .item-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
        }
        .item-name {
            font-weight: 500;
            color: #333;
        }
        .price {
            text-align: right;
        }
        .totals {
            margin-top: 20px;
            border-top: 2px solid #dee2e6;
            padding-top: 15px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }
        .total-row.final {
            font-size: 18px;
            font-weight: bold;
            color: #4CAF50;
            border-top: 2px solid #dee2e6;
            margin-top: 10px;
            padding-top: 15px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
            .items-table {
                font-size: 12px;
            }
            .item-image {
                width: 40px;
                height: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Order Confirmation</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Thank you for your order!</p>
        </div>

        <div class="order-number">
            <p style="margin: 0;">Your Order Number</p>
            <strong>{{ $order->order_number }}</strong>
        </div>

        <p>Hi {{ $order->first_name }},</p>
        <p>Thank you for your order! We've received your order and will send you a shipping confirmation email as soon as your order ships.</p>

        <!-- Shipping Information -->
        <div class="section">
            <div class="section-title">Shipping Information</div>
            <div class="info-item">
                <div class="info-label">Name:</div>
                <div class="info-value">{{ $order->first_name }} {{ $order->last_name }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Address:</div>
                <div class="info-value">
                    {{ $order->address }}@if($order->apartment), {{ $order->apartment }}@endif<br>
                    {{ $order->city }}, {{ $order->postal_code }}<br>
                    {{ $order->country }}
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Contact:</div>
                <div class="info-value">
                    Email: {{ $order->email }}<br>
                    Phone: {{ $order->phone }}
                </div>
            </div>
        </div>

        <!-- Order Items -->
        <div class="section">
            <div class="section-title">Order Items</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th class="price">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr class="item-row">
                        <td>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                @if($item->image)
                                <img src="{{ $item->image }}" alt="{{ $item->product_name }}" class="item-image">
                                @endif
                                <span class="item-name">{{ $item->product_name }}</span>
                            </div>
                        </td>
                        <td>${{ number_format($item->price, 2) }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td class="price">${{ number_format($item->price * $item->quantity, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Order Totals -->
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>${{ number_format($order->subtotal, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>${{ number_format($order->shipping, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Tax:</span>
                    <span>${{ number_format($order->tax, 2) }}</span>
                </div>
                <div class="total-row final">
                    <span>Total:</span>
                    <span>${{ number_format($order->total, 2) }}</span>
                </div>
            </div>
        </div>

        <!-- Payment Information -->
        <div class="section">
            <div class="section-title">Payment Information</div>
            <div class="info-item">
                <div class="info-label">Payment Method:</div>
                <div class="info-value">Credit Card ending in {{ $order->card_last_four }}</div>
            </div>
        </div>

        <div class="footer">
            <p>If you have any questions about your order, please contact our customer support.</p>
            <p style="margin-top: 20px; color: #999; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
            </p>
        </div>
    </div>
</body>
</html>