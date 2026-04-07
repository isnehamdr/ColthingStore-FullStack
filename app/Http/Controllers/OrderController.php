<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Mail\OrderConfirmation;
use App\Models\ActivityLog;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Validate based on payment method
        $validator = \Validator::make($request->all(), [
            'email' => 'required|email',
            'phone' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address' => 'required|string',
            'apartment' => 'nullable|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
            'country' => 'required|string',
            'payment_method' => 'required|string|in:esewa,card',
            'subtotal' => 'required|numeric',
            'shipping' => 'required|numeric',
            'tax' => 'required|numeric',
            'total' => 'required|numeric',
            'status' => 'sometimes|string',
            'cart_items' => 'required|array',
            'cart_items.*.id' => 'required',
            'cart_items.*.name' => 'required|string',
            'cart_items.*.price' => 'required|numeric',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'cart_items.*.image' => 'required|string',
            'cart_items.*.seller_id' => 'sometimes',
            'cart_items.*.seller_name' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        try {
            $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(uniqid());

            // Prepare order data
            $orderData = [
                'order_number' => $orderNumber,
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'address' => $validated['address'],
                'apartment' => $validated['apartment'] ?? null,
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
                'country' => $validated['country'],
                'payment_method' => $validated['payment_method'],
                'subtotal' => $validated['subtotal'],
                'shipping' => $validated['shipping'],
                'tax' => $validated['tax'],
                'total' => $validated['total'],
                'status' => $validated['status'] ?? 'pending',
                'user_id' => Auth::id(), // Add the logged-in user ID if authenticated
            ];

            // Only store card info if payment method is card
            if ($validated['payment_method'] === 'card') {
                $orderData['card_last_four'] = substr($validated['card_number'], -4);
            }

            $order = Order::create($orderData);

            // Create order items
            foreach ($validated['cart_items'] as $item) {
                $orderItemData = [
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'image' => $item['image'],
                ];

                // Add seller info if available
                if (isset($item['seller_id'])) {
                    $orderItemData['seller_id'] = $item['seller_id'];
                }
                if (isset($item['seller_name'])) {
                    $orderItemData['seller_name'] = $item['seller_name'];
                }

                $order->items()->create($orderItemData);
            }

            $order->load('items');

            // Send confirmation email
            Mail::to($order->email)->send(new OrderConfirmation($order));

            NotificationService::notifyUser(
                $order->user_id,
                'order_created',
                'Order placed successfully',
                "Your order {$order->order_number} has been placed.",
                ['order_id' => $order->id, 'status' => $order->status]
            );

            NotificationService::notifyAdmins(
                'admin_order_created',
                'New order received',
                "{$order->first_name} {$order->last_name} placed order {$order->order_number}.",
                ['order_id' => $order->id, 'user_id' => $order->user_id]
            );

            NotificationService::logActivity(
                'order_created',
                $request->ip(),
                "Order {$order->order_number} created by {$order->email}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => [
                    'id' => $order->id,
                    'order_number' => $orderNumber,
                    'email' => $order->email,
                    'order_items' => $order->items,
                    'order_id' => $order->id,
                    'payment_method' => $order->payment_method,
                    'total' => $order->total
                ]
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order. Please try again.',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    // Add payment status update method for eSewa callback
    public function updatePaymentStatus(Request $request, $id): JsonResponse
    {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,paid,failed,cancelled',
            'transaction_id' => 'nullable|string',
            'payment_reference' => 'nullable|string',
        ]);

        $order->update([
            'status' => $validated['status'],
            'transaction_id' => $validated['transaction_id'] ?? null,
            'payment_reference' => $validated['payment_reference'] ?? null,
        ]);

        NotificationService::notifyUser(
            $order->user_id,
            'payment_status_updated',
            'Payment status updated',
            "Payment for order {$order->order_number} is now {$order->status}.",
            ['order_id' => $order->id, 'status' => $order->status]
        );

        NotificationService::notifyAdmins(
            'admin_payment_status_updated',
            'Payment status updated',
            "Order {$order->order_number} payment status changed to {$order->status}.",
            ['order_id' => $order->id, 'status' => $order->status]
        );

        NotificationService::logActivity(
            'payment_status_updated',
            $request->ip(),
            "Order {$order->order_number} payment status updated to {$order->status}"
        );

        return response()->json([
            'success' => true,
            'message' => 'Payment status updated successfully',
            'data' => $order
        ]);
    }

    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();

            if ($user && $user->role === 'admin') {
                $orders = Order::with('items')->latest()->get();
            } else {
                if ($user) {
                    $orders = Order::with('items')
                        ->where(function ($query) use ($user) {
                            $query->where('email', $user->email)
                                ->orWhere('user_id', $user->id);
                        })
                        ->latest()
                        ->get();
                } else {
                    $orders = collect([]);
                }
            }

            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            \Log::error('Order index failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        $order = Order::with('items')->find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Check authorization - only admin or order owner can view
        $user = Auth::user();
        $isAdmin = $user && $user->role === 'admin';
        $isOwner = $user && ($order->email === $user->email || $order->user_id === $user->id);
        
        if (!$isAdmin && !$isOwner) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this order'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Check authorization
        $user = Auth::user();
        $isAdmin = $user && $user->role === 'admin';
        
        // Customers can only cancel their own orders (update status to cancelled)
        if (!$isAdmin) {
            // Check if customer owns this order
            $isOwner = $user && ($order->email === $user->email || $order->user_id === $user->id);
            
            if (!$isOwner) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this order'
                ], 403);
            }
            
            // Customers can only cancel orders, and only if status is pending or processing
            $validated = $request->validate([
                'status' => 'required|string|in:cancelled'
            ]);
            
            if (!in_array($order->status, ['pending', 'processing'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order cannot be cancelled at this stage'
                ], 400);
            }
        } else {
            // Admin can update to any status
            $validated = $request->validate([
                'status' => 'sometimes|string|in:pending,processing,shipped,delivered,cancelled,confirmed,paid,failed,completed'
            ]);
        }

        $order->update($validated);
        $order->refresh();

        $actorName = $user?->name ?? 'System';

        NotificationService::notifyUser(
            $order->user_id,
            'order_updated',
            'Order status updated',
            "Your order {$order->order_number} is now {$order->status}.",
            ['order_id' => $order->id, 'status' => $order->status]
        );

        NotificationService::notifyAdmins(
            'admin_order_updated',
            'Order updated',
            "{$actorName} changed order {$order->order_number} to {$order->status}.",
            ['order_id' => $order->id, 'status' => $order->status, 'actor_id' => $user?->id]
        );

        NotificationService::logActivity(
            'order_updated',
            $request->ip(),
            "{$actorName} updated order {$order->order_number} to {$order->status}"
        );

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully',
            'data' => $order
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Only admin can delete orders
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete orders'
            ], 403);
        }

        $orderNumber = $order->order_number;
        $order->delete();

        NotificationService::notifyAdmins(
            'admin_order_deleted',
            'Order deleted',
            "{$user->name} deleted order {$orderNumber}.",
            ['order_number' => $orderNumber, 'actor_id' => $user->id]
        );

        NotificationService::logActivity(
            'order_deleted',
            request()->ip(),
            "{$user->name} deleted order {$orderNumber}"
        );

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }
}
