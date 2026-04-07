<?php

namespace App\Http\Controllers;

use App\Models\SystemNotification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (!Schema::hasTable('system_notifications')) {
            return response()->json([
                'success' => true,
                'data' => [],
                'unread_count' => 0,
            ]);
        }

        $notifications = SystemNotification::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->take(30)
            ->get()
            ->map(fn (SystemNotification $notification) => [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'read' => (bool) $notification->read_at,
                'created_at' => optional($notification->created_at)->toISOString(),
                'data' => $notification->data,
            ])
            ->values();

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'unread_count' => $notifications->where('read', false)->count(),
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        if (!Schema::hasTable('system_notifications')) {
            return response()->json([
                'success' => true,
                'message' => 'Notifications table is not ready yet.',
            ]);
        }

        SystemNotification::query()
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Notifications marked as read.',
        ]);
    }

    public function clearAll(Request $request): JsonResponse
    {
        if (!Schema::hasTable('system_notifications')) {
            return response()->json([
                'success' => true,
                'message' => 'Notifications table is not ready yet.',
            ]);
        }

        SystemNotification::query()
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notifications cleared.',
        ]);
    }

    public function storeCartEvent(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'action' => 'required|string|in:added',
            'product_id' => 'nullable',
            'product_name' => 'required|string|max:255',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $quantity = $validated['quantity'] ?? 1;

        NotificationService::notifyUser(
            $user->id,
            'cart_added',
            'Cart updated',
            "{$validated['product_name']} was added to your cart.",
            [
                'product_id' => $validated['product_id'] ?? null,
                'quantity' => $quantity,
            ]
        );

        NotificationService::notifyAdmins(
            'customer_cart_added',
            'Customer added item to cart',
            "{$user->name} added {$validated['product_name']} to cart.",
            [
                'user_id' => $user->id,
                'product_id' => $validated['product_id'] ?? null,
                'quantity' => $quantity,
            ]
        );

        NotificationService::logActivity(
            'cart_added',
            $request->ip(),
            "{$user->name} added {$validated['product_name']} to cart"
        );

        return response()->json([
            'success' => true,
            'message' => 'Cart event stored.',
        ]);
    }
}
