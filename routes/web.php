<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnalyticsDashboardController;
use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\GoogleAnalyticsController;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
 
// New JSON endpoint consumed by the Dashboard React component:
Route::get('/dashboard/stats', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard.stats');


Route::get('/analytics', [AnalyticsDashboardController::class, 'index'])->name('analytics');




Route::middleware('auth')->group(function () {

    // Route::get('/store', function () {
    //     return Inertia::render('ClothingStoreDashboard');
    // });

    // ✅ Profile routes added here so Ziggy can find them
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Users
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::match(['put', 'patch'], '/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/product', function () {
        return Inertia::render('Product');
    });

    Route::get('/order', function () {
        return Inertia::render('OrderPage');
    });

    Route::get('/customer', function () {
        return Inertia::render('CustomerPage');
    });

    Route::get('/receipt', function () {
        return Inertia::render('Receipt');
    });


    Route::post('/ourorders', [OrderController::class, 'store'])->name('ourorders.store');
    Route::get('/ourorders/{id}', [OrderController::class, 'show'])->name('ourorders.show');
    Route::put('/ourorders/{id}', [OrderController::class, 'update'])->name('ourorders.update');
    Route::delete('/ourorders/{id}', [OrderController::class, 'destroy'])->name('ourorders.destroy');

    // Public routes if needed
    Route::post('/guest/orders', [OrderController::class, 'store']); // For guest checkout

    Route::get('/ouractivities', [ActivityLogController::class, 'index'])->name('ouractivities.index');

    Route::get('/profiles', function () {
        return Inertia::render('Profiles');
    });

    Route::get('/user', function () {
        return Inertia::render('UserManagement');
    });

    Route::get('/payment/success', function () {
        return Inertia::render('PaymentSuccess');
    });

    Route::get('/payment/failure', function () {
        return Inertia::render('PaymentFailure');
    });
});

// ✅ Public routes (no auth required)
Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/hero', function () {
    return Inertia::render('Hero');
});

Route::get('/shirt', function () {
    return Inertia::render('Shirts');
});

Route::get('/pant', function () {
    return Inertia::render('Pants');
});

Route::get('/jacket', function () {
    return Inertia::render('Jackets');
});

Route::get('/allproduct', function () {
    return Inertia::render('AllClothes');
});

Route::get('/contact', function () {
    return Inertia::render('Contact');
});

// ✅ Fixed: removed duplicate /categories route
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

Route::get('/view', function () {
    return Inertia::render('ViewDetails');
});

Route::get('/maincontent', function () {
    return Inertia::render('Maincontent');
});

Route::get('/checkout', function () {
    return Inertia::render('CheckoutForm');
});

Route::get('/thankyou', function () {
    return Inertia::render('ThankyouPage');
});

// Product routes for customers
Route::get('/ourproducts', [ProductController::class, 'index'])->name('ourproducts.index');

// Order for customers
Route::get('/ourorders', [OrderController::class, 'index'])->name('ourorders.index');

Route::get('/analytics', function () {
    return Inertia::render('Analytics');
});

Route::get('/setting', function () {
    return Inertia::render('Setting');
});

Route::get('/detailpage/{slug}', function ($slug) {
    return Inertia::render('ProductDetailPage', [
        'slug' => $slug,
    ]);
})->name('product.detail');

Route::get('/detailsproduct/{slug}', function ($slug) {
    return Inertia::render('ProductsDetailPages', [
        'slug' => $slug,
    ]);
});

// Admin only routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/activitylog', function () {
        return Inertia::render('Activitylog');
    });

    Route::post('/ourproducts', [ProductController::class, 'store'])->name('ourproducts.store');
    Route::put('/ourproducts/{id}', [ProductController::class, 'update'])->name('ourproducts.update');
    Route::delete('/ourproducts/{id}', [ProductController::class, 'destroy'])->name('ourproducts.destroy');
    Route::apiResource('products', ProductController::class);
    Route::delete('products/{id}/images/{imageId}', [ProductController::class, 'destroyImage'])->name('ourproducts.images.destroy');
});

// Google Auth
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.login');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);


    Route::get('/analytics', [GoogleAnalyticsController::class, 'index'])->name('analytics');
    Route::get('/analytics/data', [GoogleAnalyticsController::class, 'getData'])->name('analytics.data');

// Route::get('/test', fn() => Analytics::fetchMostVisitedPages(Period::days(7)));


    // Route::get('/test', function () {
    //     $data = Analytics::fetchMostVisitedPages(Period::days(30));
    //     return response()->json($data);
    // });

    Route::get('/test', function () {
        $data = Analytics::fetchMostVisitedPages(Period::days(30));

        return response()->json($data);
    });


require __DIR__.'/auth.php';
