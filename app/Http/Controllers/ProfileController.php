<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('auth');
        }

        // Get user statistics
        $totalOrders = $user->orders()->count();
        $totalSpent = $user->orders()->sum('total');

        return Inertia::render('Profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'city' => $user->city,
                'state' => $user->state,
                'zipCode' => $user->zip_code,
                'country' => $user->country,
                'memberSince' => $user->created_at->format('M Y'),
            ],
            'stats' => [
                'totalOrders' => $totalOrders,
                'totalSpent' => (float) $totalSpent,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('auth');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zipCode' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'zip_code' => $request->zipCode,
            'country' => $request->country,
        ]);

        return redirect()->route('profile')->with('success', 'Profile updated successfully');
    }
}
