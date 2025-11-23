<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = [
            [
                'src' => '/images/c1.avif',
                'label' => 'SHIRTS',
                'route' => '/shirt'
            ],
            [
                'src' => '/images/c2.avif',
                'label' => 'PANTS', 
                'route' => '/pant'
            ],
            [
                'src' => '/images/c3.avif',
                'label' => 'JACKETS',
                'route' => '/jacket'
            ],
            [
                'src' => '/images/c4.avif',
                'label' => 'ALL PRODUCTS',
                'route' => '/allproduct'
            ]
        ];

        return response()->json([
            'categories' => $categories
        ]);
    }
}