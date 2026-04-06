<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $now = Carbon::now();

        // ── Revenue: only "completed" orders ──────────────────────────────────
        $totalRevenue = Order::where('status', 'completed')->sum('total');

        // ── Orders ────────────────────────────────────────────────────────────
        $totalOrders  = Order::count();

        // ── Products (actually stored in DB) ──────────────────────────────────
        $totalProducts = Product::count();

        // ── Users ─────────────────────────────────────────────────────────────
        $totalUsers = \App\Models\User::count();

        // ── Period-over-period changes (last 30 days vs prior 30 days) ────────
        $last30Start = $now->copy()->subDays(30);
        $prev30Start = $now->copy()->subDays(60);

        $revenueThisPeriod = Order::where('status', 'completed')
            ->where('created_at', '>=', $last30Start)->sum('total');

        $revenuePrevPeriod = Order::where('status', 'completed')
            ->whereBetween('created_at', [$prev30Start, $last30Start])->sum('total');

        $ordersThisPeriod = Order::where('created_at', '>=', $last30Start)->count();
        $ordersPrevPeriod = Order::whereBetween('created_at', [$prev30Start, $last30Start])->count();

        $productsThisPeriod = Product::where('created_at', '>=', $last30Start)->count();
        $productsPrevPeriod = Product::whereBetween('created_at', [$prev30Start, $last30Start])->count();

        $usersThisPeriod = \App\Models\User::where('created_at', '>=', $last30Start)->count();
        $usersPrevPeriod = \App\Models\User::whereBetween('created_at', [$prev30Start, $last30Start])->count();

        // ── Revenue chart – last 7 days (completed only) ──────────────────────
        $revenueChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $day   = $now->copy()->subDays($i);
            $label = $day->format('D'); // Mon, Tue …

            $revenue = Order::where('status', 'completed')
                ->whereDate('created_at', $day->toDateString())
                ->sum('total');

            $revenueChart[] = ['name' => $label, 'revenue' => (float) $revenue];
        }

        // ── Orders chart – last 7 days (all statuses) ─────────────────────────
        $ordersChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $day   = $now->copy()->subDays($i);
            $count = Order::whereDate('created_at', $day->toDateString())->count();

            $ordersChart[] = ['name' => $day->format('D'), 'orders' => $count];
        }

        // ── Sales by category (from completed orders → join order_items → products) ─
        $categoryData = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.status', 'completed')
            ->select('products.category', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.category')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        $totalSold = $categoryData->sum('total_sold') ?: 1;
        $categoryFormatted = $categoryData->map(fn($row) => [
            'name'  => $row->category,
            'value' => round(($row->total_sold / $totalSold) * 100, 1),
        ])->values()->toArray();

        // ── Top products by completed-order revenue ───────────────────────────
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->select(
                'order_items.product_name',
                DB::raw('SUM(order_items.quantity) as total_sales'),
                DB::raw('SUM(order_items.price * order_items.quantity) as total_revenue')
            )
            ->groupBy('order_items.product_name')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'name'    => $p->product_name,
                'sales'   => (int) $p->total_sales,
                'revenue' => '$' . number_format($p->total_revenue, 2),
            ])->values()->toArray();

        // ── Recent 5 orders ───────────────────────────────────────────────────
        $recentOrders = Order::latest()->limit(5)->get()->map(fn($o) => [
            'id'       => '#' . $o->order_number,
            'customer' => trim($o->first_name . ' ' . $o->last_name),
            'amount'   => '$' . number_format($o->total, 2),
            'status'   => ucfirst($o->status),
            'date'     => $o->created_at->diffForHumans(),
        ])->values()->toArray();

        // ── Helper: percentage change ─────────────────────────────────────────
        $pct = function ($current, $previous): string {
            if ($previous == 0) return $current > 0 ? '+100%' : '0%';
            $change = (($current - $previous) / $previous) * 100;
            return ($change >= 0 ? '+' : '') . round($change, 1) . '%';
        };

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    [
                        'name'      => 'Total Revenue',
                        'value'     => '$' . number_format($totalRevenue, 2),
                        'change'    => $pct($revenueThisPeriod, $revenuePrevPeriod),
                        'trend'     => $revenueThisPeriod >= $revenuePrevPeriod ? 'up' : 'down',
                        'icon'      => 'dollar',
                        'color'     => 'green',
                    ],
                    [
                        'name'      => 'Total Orders',
                        'value'     => number_format($totalOrders),
                        'change'    => $pct($ordersThisPeriod, $ordersPrevPeriod),
                        'trend'     => $ordersThisPeriod >= $ordersPrevPeriod ? 'up' : 'down',
                        'icon'      => 'cart',
                        'color'     => 'blue',
                    ],
                    [
                        'name'      => 'Total Products',
                        'value'     => number_format($totalProducts),
                        'change'    => $pct($productsThisPeriod, $productsPrevPeriod),
                        'trend'     => $productsThisPeriod >= $productsPrevPeriod ? 'up' : 'down',
                        'icon'      => 'package',
                        'color'     => 'purple',
                    ],
                    [
                        'name'      => 'Active Users',
                        'value'     => number_format($totalUsers),
                        'change'    => $pct($usersThisPeriod, $usersPrevPeriod),
                        'trend'     => $usersThisPeriod >= $usersPrevPeriod ? 'up' : 'down',
                        'icon'      => 'users',
                        'color'     => 'orange',
                    ],
                ],
                'revenueChart'  => $revenueChart,
                'ordersChart'   => $ordersChart,
                'categoryData'  => $categoryFormatted,
                'topProducts'   => $topProducts,
                'recentOrders'  => $recentOrders,
            ],
        ]);
    }
}