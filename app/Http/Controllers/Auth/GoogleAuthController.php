<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Inertia\Inertia;
use GuzzleHttp\Client;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        // Log the redirect URI for debugging
        \Log::info('Initiating Google OAuth with redirect URI: ' . config('services.google.redirect'));

        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request)
    {
        try {
            \Log::info('Google OAuth callback received');

            // ✅ Disable SSL verification for local environment
            $googleUser = Socialite::driver('google')
                ->setHttpClient(new Client(['verify' => false])) // disable SSL check
                ->stateless() // recommended when using React/Vue frontend
                ->user();

            \Log::info('Google user authenticated: ' . $googleUser->getEmail());

            // Check if user exists or create a new one
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => Hash::make(Str::random(24)),
                    'email_verified_at' => now(),
                    'role' => 'customer',
                ]);

                \Log::info('New customer user created via Google OAuth: ' . $user->email);
            } else {
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                }

                \Log::info('Existing customer user logged in via Google OAuth: ' . $user->email);
            }

            // Log the user in
            Auth::login($user, true);

            \Log::info('Customer logged in successfully, redirecting to home page');

            // Redirect to home page
            return redirect()->route('/');

        } catch (\Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            \Log::error('Google OAuth Stack Trace: ' . $e->getTraceAsString());

            return redirect()->route('login')->withErrors([
                'email' => 'Unable to authenticate with Google. Please try again.'
            ]);
        }
    }
}
