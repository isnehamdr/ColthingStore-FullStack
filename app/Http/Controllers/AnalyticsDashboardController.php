<?php

namespace App\Http\Controllers;

use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;

class AnalyticsDashboardController extends Controller
{
    public function index()
    {
        $period = Period::days(30);

        // Total visitors and page views
        $totals = Analytics::fetchTotalVisitorsAndPageViews($period);
        $totalVisitors = 0;
        $totalPageViews = 0;

        foreach ($totals as $item) {
            $totalVisitors  += (int) ($item['activeUsers']     ?? 0);
            $totalPageViews += (int) ($item['screenPageViews'] ?? 0);
        }

        // Daily visitors & page views
        $visitorsAndPageViews = Analytics::fetchVisitorsAndPageViews($period);
        $formattedData = [];
        foreach ($visitorsAndPageViews as $item) {
            $formattedData[] = [
                'date'          => $item['date']          ?? null,
                'visitors'      => (int) ($item['activeUsers']     ?? 0),
                'pageViews'     => (int) ($item['screenPageViews'] ?? 0),
            ];
        }

        // Most visited pages
        $mostVisitedPages = Analytics::fetchMostVisitedPages($period, 20);
        $formattedPages = [];
        foreach ($mostVisitedPages as $page) {
            $formattedPages[] = [
                'pageTitle'       => $page['pageTitle']       ?? 'Unknown',
                'fullPageUrl'     => $page['fullPageUrl']     ?? '',
                'screenPageViews' => (int) ($page['screenPageViews'] ?? 0),
            ];
        }

        // Top browsers
        $topBrowsers = Analytics::fetchTopBrowsers($period, 10);

        return response()->json([
            'totalVisitors'        => $totalVisitors,
            'totalPageViews'       => $totalPageViews,
            'visitorsAndPageViews' => $formattedData,
            'topPages'             => $formattedPages,
            'topBrowsers'          => $topBrowsers,
        ]);
    }
}
