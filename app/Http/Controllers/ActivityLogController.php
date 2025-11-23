<?php
// app/Http/Controllers/ActivityLogController.php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    public function index(Request $request)
   {
    $logs = ActivityLog::latest()->get();


    return response()->json([
         'success' => true,
         'data' => $logs
     ]);
   }

  
}