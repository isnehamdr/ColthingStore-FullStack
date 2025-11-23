<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; 

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {   

        if(!Auth::check()) {
            return redirect(route('login'));
        }

        $user = $request->user();

        // if ($request->user()->role !== $role) {
        //     abort(403, 'Unauthorized');
        // }


        // return $next($request);

        // foreach ($roles as $role) {
        //     if ($user->role === $role) {
        //         return $next($request);
        //     }
        // }

        // abort(403, 'Unauthorized');


        $allowedRoles = [];
        foreach ($roles as $roleGroup) {
            $allowedRoles = array_merge($allowedRoles, explode('|', $roleGroup));
        }
        
        if (in_array($user->role, $allowedRoles)) {
            return $next($request);
        }
        
        abort(403, 'Unauthorized');

    }
}