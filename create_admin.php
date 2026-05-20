<?php

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

// Try to find if an admin exists
$admin = User::where('username', 'admin')->first();

if (!$admin) {
    // Generate a random string that resembles a CUID
    $id = 'c' . substr(md5(uniqid(rand(), true)), 0, 24);
    
    User::create([
        'id' => $id,
        'username' => 'admin',
        'password' => Hash::make('password123'),
        'role' => 'ADMIN',
    ]);
    echo "Admin user created successfully! Username: admin, Password: password123\n";
} else {
    // Update password just in case
    $admin->update(['password' => Hash::make('password123')]);
    echo "Admin user updated! Username: admin, Password: password123\n";
}
