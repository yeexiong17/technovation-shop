<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RedirectAdminToDashboard
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        // If user is admin and trying to access non-admin pages, redirect to admin dashboard
        if ($user && $user->is_admin && !$request->is('admin*')) {
            return redirect()->route('admin');
        }

        return $next($request);
    }
}

