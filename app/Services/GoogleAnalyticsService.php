<?php

namespace App\Services;

use Google\Client;
use Google\Service\AnalyticsData;
use Google\Service\AnalyticsData\DateRange;
use Google\Service\AnalyticsData\Dimension;
use Google\Service\AnalyticsData\Metric;
use Google\Service\AnalyticsData\RunReportRequest;
use Google\Service\AnalyticsData\RunRealtimeReportRequest;
use Illuminate\Support\Facades\Log;

class GoogleAnalyticsService
{
    private $service;
    private $propertyId;

    public function __construct()
    {
        try {
            $client = new Client();
            
            // For development only - fix SSL for production
            $httpClient = new \GuzzleHttp\Client([
                'verify' => !app()->environment('local'), // Only disable in local
                'curl' => app()->environment('local') ? [
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => false,
                ] : []
            ]);
            $client->setHttpClient($httpClient);
            
            $credentialsPath = storage_path('app/analytics/clothingstore.json');
            
            if (!file_exists($credentialsPath)) {
                Log::error('GA4: Credentials file not found at: ' . $credentialsPath);
                throw new \Exception('Credentials file not found');
            }
            
            $client->setAuthConfig($credentialsPath);
            $client->addScope(AnalyticsData::ANALYTICS_READONLY);
            
            $this->service = new AnalyticsData($client);
            $this->propertyId = config('services.google_analytics.property_id');
            
            if (!$this->propertyId) {
                Log::error('GA4: Property ID is not set in config');
                throw new \Exception('Property ID not configured');
            }
            
        } catch (\Exception $e) {
            Log::error('GA4 Constructor error: ' . $e->getMessage());
            throw $e;
        }
    }

    // NEW METHOD: Get daily visitors and page views for chart
    public function getDailyVisitorsAndPageViews($startDate = '30daysAgo', $endDate = 'today')
    {
        try {
            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ])
            ]);
            
            $request->setMetrics([
                new Metric(['name' => 'activeUsers']), // Visitors
                new Metric(['name' => 'screenPageViews']), // Page views
            ]);
            
            $request->setDimensions([
                new Dimension(['name' => 'date']),
            ]);

            $response = $this->service->properties->runReport(
                'properties/' . $this->propertyId, 
                $request
            );
            
            return $this->formatDailyData($response);
        } catch (\Exception $e) {
            Log::error('GA4 Daily Data Error: ' . $e->getMessage());
            return [];
        }
    }

    // NEW METHOD: Get top browsers
    public function getTopBrowsers($startDate = '30daysAgo', $endDate = 'today')
    {
        try {
            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ])
            ]);
            
            $request->setMetrics([
                new Metric(['name' => 'activeUsers']),
            ]);
            
            $request->setDimensions([
                new Dimension(['name' => 'browser']),
            ]);
            
            $request->setLimit(10);

            $response = $this->service->properties->runReport(
                'properties/' . $this->propertyId, 
                $request
            );
            
            return $this->formatBrowserData($response);
        } catch (\Exception $e) {
            Log::error('GA4 Top Browsers Error: ' . $e->getMessage());
            return [];
        }
    }

    // Existing methods...
    public function getSummaryStats($startDate = '30daysAgo', $endDate = 'today')
    {
        try {
            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ])
            ]);
            
            $request->setMetrics([
                new Metric(['name' => 'screenPageViews']),
                new Metric(['name' => 'sessions']),
                new Metric(['name' => 'activeUsers']),
                new Metric(['name' => 'newUsers']),
                new Metric(['name' => 'averageSessionDuration']),
                new Metric(['name' => 'bounceRate']),
            ]);

            $response = $this->service->properties->runReport(
                'properties/' . $this->propertyId, 
                $request
            );
            
            if ($response->getRows() && count($response->getRows()) > 0) {
                $row = $response->getRows()[0];
                $metrics = $row->getMetricValues();
                
                return [
                    'pageViews' => (int) $metrics[0]->getValue(),
                    'sessions' => (int) $metrics[1]->getValue(),
                    'users' => (int) $metrics[2]->getValue(),
                    'newUsers' => (int) $metrics[3]->getValue(),
                    'avgSessionDuration' => round((float) $metrics[4]->getValue(), 2),
                    'bounceRate' => round((float) $metrics[5]->getValue() * 100, 2),
                ];
            }
            
            return [
                'pageViews' => 0,
                'sessions' => 0,
                'users' => 0,
                'newUsers' => 0,
                'avgSessionDuration' => 0,
                'bounceRate' => 0,
            ];
        } catch (\Exception $e) {
            Log::error('GA4 Summary Stats Error: ' . $e->getMessage());
            return [
                'pageViews' => 0,
                'sessions' => 0,
                'users' => 0,
                'newUsers' => 0,
                'avgSessionDuration' => 0,
                'bounceRate' => 0,
            ];
        }
    }

    public function getTopPages($startDate = '30daysAgo', $endDate = 'today')
    {
        try {
            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ])
            ]);
            
            $request->setMetrics([
                new Metric(['name' => 'screenPageViews']),
            ]);
            
            $request->setDimensions([
                new Dimension(['name' => 'pageTitle']),
                new Dimension(['name' => 'pagePath']),
            ]);
            
            $request->setLimit(10);

            $response = $this->service->properties->runReport(
                'properties/' . $this->propertyId, 
                $request
            );
            
            return $this->formatTopPagesResponse($response);
        } catch (\Exception $e) {
            Log::error('GA4 Top Pages Error: ' . $e->getMessage());
            return [];
        }
    }

    // Helper methods for formatting
    private function formatDailyData($response)
    {
        $data = [];
        if ($response->getRows()) {
            foreach ($response->getRows() as $row) {
                $dimensions = $row->getDimensionValues();
                $metrics = $row->getMetricValues();
                
                // Format date from YYYYMMDD to something readable
                $date = $dimensions[0]->getValue();
                $formattedDate = date('M d', strtotime($date));
                
                $data[] = [
                    'date' => $formattedDate,
                    'visitors' => (int) $metrics[0]->getValue(),
                    'pageViews' => (int) $metrics[1]->getValue(),
                ];
            }
        }
        
        // Sort by date
        usort($data, fn($a, $b) => strtotime($a['date']) <=> strtotime($b['date']));
        
        return $data;
    }

    private function formatBrowserData($response)
    {
        $data = [];
        if ($response->getRows()) {
            foreach ($response->getRows() as $row) {
                $dimensions = $row->getDimensionValues();
                $metrics = $row->getMetricValues();
                
                $data[] = [
                    'browser' => $dimensions[0]->getValue(),
                    'visitors' => (int) $metrics[0]->getValue(),
                ];
            }
        }
        
        return $data;
    }

    private function formatTopPagesResponse($response)
    {
        $data = [];
        if ($response->getRows()) {
            foreach ($response->getRows() as $row) {
                $dimensions = $row->getDimensionValues();
                $metrics = $row->getMetricValues();
                
                $data[] = [
                    'pageTitle' => $dimensions[0]->getValue(),
                    'pagePath' => $dimensions[1]->getValue(),
                    'screenPageViews' => (int) $metrics[0]->getValue(),
                ];
            }
        }
        
        usort($data, fn($a, $b) => $b['screenPageViews'] <=> $a['screenPageViews']);
        
        return $data;
    }
}