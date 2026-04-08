<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $products = $this->baseProductQuery()->get();
            
            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function saleShowcase()
    // {
    //     try {
    //         $products = $this->baseProductQuery()
    //             ->where('is_sale', true)
    //             ->latest()
    //             ->take(6)
    //             ->get();

    //         return response()->json([
    //             'success' => true,
    //             'data' => $products->map(fn (Product $product) => $this->transformStorefrontProduct($product))->values(),
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('Sale showcase fetch error: ' . $e->getMessage());

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to fetch sale showcase products',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function saleShowcase()
{
    try {
        $products = $this->baseProductQuery()
            ->where('is_sale', true)
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products->map(
                fn (Product $product) => $this->transformStorefrontProduct($product)
            )->values(),
        ]);
    } catch (\Exception $e) {
        Log::error('Sale showcase fetch error: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch sale showcase products',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    public function categoryShowcase()
    {
        try {
            $products = $this->baseProductQuery()->latest()->get();

            $categories = $products
                ->filter(fn (Product $product) => filled($product->category))
                ->groupBy(fn (Product $product) => strtolower(trim($product->category)))
                ->map(function (Collection $group) {
                    $product = $group->first();

                    return [
                        'label' => strtoupper($product->category),
                        'name' => $product->category,
                        'src' => $this->resolveProductImageUrl($product), // ✅ fixed
                        'route' => $this->resolveCategoryRoute($product->category),
                    ];
                })
                ->values();

            $saleProduct = $products->first(fn (Product $product) => (bool) $product->is_sale);

            if ($saleProduct) {
                $categories = collect([[
                    'label' => 'SALE',
                    'name' => 'Sale',
                    'src' => $this->resolveProductImageUrl($saleProduct),
                    'route' => '/allproduct',
                ]])->concat(
                    $categories->reject(fn ($category) => strtolower($category['name']) === 'sale')
                );
            }

            $categories = $categories->take(4)->values();

            return response()->json([
                'success' => true,
                'categories' => $categories,
            ]);
        } catch (\Exception $e) {
            Log::error('Category showcase fetch error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch category showcase',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0|lte:price',
                'stock' => 'required|integer|min:0',
                'description' => 'nullable|string',
                'size' => 'nullable|string',
                'color' => 'nullable|string',
                'is_sale' => 'nullable|boolean',
                'slug' => 'required|string|unique:products,slug',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $product = Product::create($request->only([
                'product_name','category','price','discount_price',
                'stock','description','size','color','slug'
            ]) + [
                'is_sale' => $request->boolean('is_sale')
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $this->storeImage($image, $product->id, $index === 0);
                }
            }

            return response()->json([
                'success' => true,
                'data' => $product->load('images')
            ], 201);

        } catch (\Exception $e) {
            Log::error('Product store error: ' . $e->getMessage());
            return response()->json(['success' => false], 500);
        }
    }

    private function storeImage($imageFile, $productId, $isPrimary = false)
    {
        $filename = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
        $path = 'products/' . $filename;

        Storage::disk('public')->put($path, file_get_contents($imageFile));

        ProductImage::create([
            'product_id' => $productId,
            'image_path' => $path,
            'is_primary' => $isPrimary,
        ]);
    }

    private function baseProductQuery()
    {
        return Product::with(['images' => function ($query) {
            $query->orderBy('is_primary', 'desc')->orderBy('id');
        }]);
    }

    // private function transformStorefrontProduct(Product $product)
    // {
    //     return [
    //         'id' => $product->id,
    //         'product_name' => $product->product_name,
    //         'category' => $product->category,
    //         'price' => $product->price,
    //         'discount_price' => $product->discount_price,
    //         'is_sale' => $product->is_sale,
    //         'slug' => $product->slug,
    //         'image_url' => $this->resolveProductImageUrl($product), // ✅ fixed
    //     ];
    // }

    private function transformStorefrontProduct(Product $product)
{
    return [
        'id' => $product->id,
        'product_name' => $product->product_name,
        'category' => $product->category,
        'price' => (float) $product->price,
        'discount_price' => $product->discount_price ? (float) $product->discount_price : null,
        'is_sale' => (bool) $product->is_sale,
        'slug' => $product->slug,

        // ✅ FIXED IMAGE
        'image_url' => $this->resolveProductImageUrl($product),
    ];
}

    // ✅🔥 MAIN FIX HERE
    // private function resolveProductImageUrl(Product $product)
    // {
    //     $product->loadMissing('images');
    //     $image = $product->images->sortByDesc('is_primary')->first();

    //     if ($image && filled($image->image_path)) {
    //         return $image->image_path; // ✅ ONLY RELATIVE PATH
    //     }

    //     return 'images/placeholder-shirt.jpg';
    // }

private function resolveProductImageUrl(Product $product)
{
    $product->loadMissing('images');

    $image = $product->images
        ->sortByDesc('is_primary')
        ->first();

    if ($image && filled($image->image_path)) {

        // ✅ REMOVE /storage/ if exists
        $path = ltrim($image->image_path, '/');
        $path = str_replace('storage/', '', $path);

        return $path; // ✅ FINAL: products/xxx.jpg
    }

    return 'images/placeholder-shirt.jpg';
}

    private function resolveCategoryRoute($category)
    {
        $value = strtolower($category);

        if (str_contains($value, 'shirt')) return '/shirt';
        if (str_contains($value, 'pant') || str_contains($value, 'jean')) return '/pant';
        if (str_contains($value, 'jacket')) return '/jacket';

        return '/allproduct';
    }
}