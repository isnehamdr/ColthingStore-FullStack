<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        NotificationService::notifyUser(
            $user?->id,
            'login',
            'Login successful',
            'You logged into your account successfully.',
            ['logged_in_at' => now()->toISOString()]
        );

        if ($user) {
            NotificationService::notifyAdmins(
                'admin_user_login',
                'User login',
                "{$user->name} logged in.",
                ['user_id' => $user->id]
            );

            NotificationService::logActivity(
                'login',
                $request->ip(),
                "{$user->name} logged in"
            );
        }

        return redirect()->intended('/');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($user) {
            NotificationService::notifyAdmins(
                'admin_user_logout',
                'User logout',
                "{$user->name} logged out.",
                ['user_id' => $user->id]
            );

            NotificationService::logActivity(
                'logout',
                $request->ip(),
                "{$user->name} logged out"
            );
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['redirect'=>'/login']);
    }
}
