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


use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
   Route::get('/store', function () {
    return Inertia::render('ClothingStoreDashboard');
});


//users
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

    Route::get('/ouractivities', [ActivityLogController::class,'index'])->name('ouractivities.index');

    Route::get('/profiles', function () {
    return Inertia::render('Profiles');
});

Route::get('/user', function () {
    return Inertia::render('UserManagement'); // Changed to match file name
});



Route::get('/payment/success', function () {
    return Inertia::render('PaymentSuccess'); // Changed to match file name
});


Route::get('/payment/failure', function () {
    return Inertia::render('PaymentFailure'); // Changed to match file name
});

  
});




Route::get('/home', function () {
    return Inertia::render('Home');
});

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

Route::get('/categories', function () {
    return Inertia::render('Categorypage');
});
Route::get('/categories', [CategoryController::class, 'index']);





Route::get('/view', function () {
    return Inertia::render('ViewDetails');
});

Route::get('/maincontent', function () {
    return Inertia::render('Maincontent');
});

Route::get('/checkout', function () {
    return Inertia::render('CheckoutForm'); // Changed to match file name
});

Route::get('/thankyou', function () {
    return Inertia::render('ThankyouPage'); // Changed to match file name
});





// Product routes for the customer to show website
Route::get('/ourproducts', [ProductController::class, 'index'])->name('ourproducts.index');

// Order for the customer
Route::get('/ourorders', [OrderController::class, 'index'])->name('ourorders.index');




Route::get('/analytics', function () {
    return Inertia::render('Analytics'); // Changed to match file name
});

Route::get('/setting', function () {
    return Inertia::render('Setting'); // Changed to match file name
});
Route::get('/detailpage/{slug}', function ($slug) {
    return Inertia::render('ProductDetailPage', [
        'slug' => $slug
    ]);
})->name('product.detail');

// In routes/web.php
Route::get('/detailsproduct/{slug}', function ($slug) {
    return Inertia::render('ProductsDetailPages', [
        'slug' => $slug
    ]);
});



// Route::get('/api/user/role', function () {
//     return response()->json([
//         'role' => Auth::check() ? Auth::user()->role : 'guest'
//     ]);
// })->middleware('auth');

//by doing this only admin cna see this part 

Route::middleware(['auth', 'role:admin'])->group(function() {
   //activityLog
    Route::get('/activitylog', function () {
    return Inertia::render('Activitylog');
});

//product
Route::post('/ourproducts', [ProductController::class, 'store'])->name('ourproducts.store');
Route::put('/ourproducts/{id}', [ProductController::class, 'update'])->name('ourproducts.update');
Route::delete('/ourproducts/{id}', [ProductController::class, 'destroy'])->name('ourproducts.destroy');
Route::apiResource('products', ProductController::class);
Route::delete('products/{id}/images/{imageId}', [ProductController::class, 'destroyImage'])->name('ourproducts.images.destroy');
});




   Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.login');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);
//     Route::post('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])
//     ->name('google.login');

// Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
//     ->name('google.callback');


require __DIR__.'/auth.php';
