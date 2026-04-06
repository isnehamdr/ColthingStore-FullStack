<?php

namespace App\Providers;

use Google\Analytics\Data\V1beta\Client\BetaAnalyticsDataClient;
use Google\Auth\HttpHandler\HttpHandlerFactory;
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Spatie\Analytics\AnalyticsClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AnalyticsClient::class, function () {
            $analyticsConfig = config('analytics');

            if (app()->environment('local')) {
                $guzzle = new GuzzleClient(['verify' => false]);
                $httpHandler = HttpHandlerFactory::build($guzzle);

                $googleService = new BetaAnalyticsDataClient([
                    'credentials' => $analyticsConfig['service_account_credentials_json'],
                    'transport' => 'rest',
                    'transportConfig' => [
                        'rest' => [
                            'httpHandler' => $httpHandler,
                        ],
                    ],
                ]);
            } else {
                $googleService = new BetaAnalyticsDataClient([
                    'credentials' => $analyticsConfig['service_account_credentials_json'],
                ]);
            }

            $client = new AnalyticsClient($googleService, app(Repository::class));
            $client->setCacheLifeTimeInMinutes($analyticsConfig['cache_lifetime_in_minutes']);

            return $client;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        RedirectIfAuthenticated::redirectUsing(fn () => '/');
    }
}
