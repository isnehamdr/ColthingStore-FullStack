<?php
// app/Http/Controllers/Admin/GoogleAnalyticsController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\GoogleAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GoogleAnalyticsController extends Controller
{
    public function __construct(
        private GoogleAnalyticsService $analyticsService
    ) {}

    public function index()
    {
        return Inertia::render('Analytics', [
            'initialData' => $this->getAnalyticsData()
        ]);
    }

    public function getData(Request $request)
    {
        try {
            $startDate = $request->get('startDate', '30daysAgo');
            $endDate = $request->get('endDate', 'today');

            $data = $this->getAnalyticsData($startDate, $endDate);
            
            return response()->json($data);
        } catch (\Exception $e) {
            \Log::error('Analytics API Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch analytics data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function getAnalyticsData($startDate = '30daysAgo', $endDate = 'today')
    {
        // Get data from GA4 service
        $summaryStats = $this->analyticsService->getSummaryStats($startDate, $endDate);
        $dailyData = $this->analyticsService->getDailyVisitorsAndPageViews($startDate, $endDate);
        $topPages = $this->analyticsService->getTopPages($startDate, $endDate);
        $topBrowsers = $this->analyticsService->getTopBrowsers($startDate, $endDate);

        return [
            'totalVisitors' => $summaryStats['users'] ?? 0,
            'totalPageViews' => $summaryStats['pageViews'] ?? 0,
            'visitorsAndPageViews' => $dailyData,
            'topPages' => $topPages,
            'topBrowsers' => $topBrowsers,
        ];
    }
}