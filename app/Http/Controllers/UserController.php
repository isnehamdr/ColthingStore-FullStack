<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    private function transformUser(User $user): array
    {
        $data = $user->toArray();
        $data['image'] = $user->image ?: $user->avatar;

        return $data;
    }

    /**
     * Display a listing of all users.
     */
    public function index()
    {
        $actor = Auth::user();

        if (!$actor || $actor->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $users = User::all()->map(fn (User $user) => $this->transformUser($user));
        return response()->json($users);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $actor = Auth::user();

        if (!$actor || $actor->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users',
            'password'      => 'required|string|min:6',
            'role'          => 'nullable|string|max:50',
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,gif|max:5120',
            'address'       => 'nullable|string|max:255',
            'phone_number'  => 'nullable|string|max:20',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('users', 'public');
            $validated['image'] = $path;
        }

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully!',
            'data' => $this->transformUser($user),
        ], 201);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'email'         => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'bio'           => 'nullable|string|max:500',
            'password'      => 'nullable|string|min:6',
            'password_confirmation' => 'nullable|string|min:6',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8|confirmed',
            'new_password_confirmation' => 'nullable|string|min:8',
            'role'          => 'nullable|string|max:50',
            'image'         => 'nullable|image|mimes:jpg,jpeg,png,gif|max:5120',
            'address'       => 'nullable|string|max:255',
            'phone_number'  => 'nullable|string|max:20',
            'notification_settings' => 'nullable|array',
        ]);

        $actor = Auth::user();
        $originalEmail = $user->email;
        $changedFields = [];
        $isAdmin = $actor && $actor->role === 'admin';
        $isSelfUpdate = $actor && $actor->id === $user->id;

        if (!$isAdmin && !$isSelfUpdate) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$isAdmin) {
            unset($validated['role']);
        }

        // Handle image update
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }
            $path = $request->file('image')->store('users', 'public');
            $validated['image'] = $path;
            $changedFields[] = 'profile image';
        }

        // Handle password update
        if (!empty($validated['new_password'])) {
            if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors([
                    'current_password' => 'The current password is incorrect.',
                ]);
            }

            $validated['password'] = $validated['new_password'];
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
            $changedFields[] = 'password';
        } else {
            unset($validated['password']);
        }

        unset(
            $validated['current_password'],
            $validated['new_password'],
            $validated['new_password_confirmation'],
            $validated['password_confirmation']
        );

        foreach (['name', 'email', 'address', 'phone_number', 'role', 'notification_settings'] as $field) {
            if (array_key_exists($field, $validated)) {
                $changedFields[] = str_replace('_', ' ', $field);
            }
        }

        $user->update($validated);
        $user->refresh();

        $changes = collect($changedFields)->unique()->values();
        if ($changes->isNotEmpty()) {
            NotificationService::notifyUser(
                $user->id,
                'profile_updated',
                'Profile updated',
                "Your {$changes->implode(', ')} was updated successfully.",
                ['changed_fields' => $changes->all()]
            );

            NotificationService::notifyAdmins(
                'user_updated',
                'User profile updated',
                ($actor?->name ?? $user->name) . " updated {$user->name}'s {$changes->implode(', ')}.",
                [
                    'user_id' => $user->id,
                    'actor_id' => $actor?->id,
                    'changed_fields' => $changes->all(),
                ]
            );

            NotificationService::logActivity(
                'user_updated',
                $request->ip(),
                ($actor?->name ?? $user->name) . " updated {$user->name}'s {$changes->implode(', ')}"
            );
        }

        if ($originalEmail !== $user->email) {
            NotificationService::notifyUser(
                $user->id,
                'email_updated',
                'Email updated',
                "Your email address was changed to {$user->email}.",
                ['previous_email' => $originalEmail, 'new_email' => $user->email]
            );
        }

        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'message' => 'User updated successfully!',
                'data' => $this->transformUser($user),
            ]);
        }

        return redirect()->back()->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $actor = Auth::user();

        if (!$actor || $actor->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Delete stored image if exists
        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }

        NotificationService::notifyAdmins(
            'user_deleted',
            'User deleted',
            ($actor?->name ?? 'A user') . " deleted {$user->name}.",
            ['user_id' => $user->id, 'actor_id' => $actor?->id]
        );

        NotificationService::logActivity(
            'user_deleted',
            request()->ip(),
            ($actor?->name ?? 'A user') . " deleted {$user->name}"
        );

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully!',
        ]);
    }
    
}
