<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $products = Product::with(['images' => function($query) {
                return $query->orderBy('is_primary', 'desc');
            }])->get();
            
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

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'description' => 'nullable|string',
                'size' => 'nullable|string',
                'color' => 'nullable|string',
                'slug' => 'required|string|unique:products,slug',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create the product
            $product = Product::create([
                'product_name' => $request->product_name,
                'category' => $request->category,
                'price' => $request->price,
                'stock' => $request->stock,
                'description' => $request->description,
                'size' => $request->size,
                'color' => $request->color,
                'slug' => $request->slug,
            ]);

            // Handle multiple images upload
            if ($request->hasFile('images')) {
                $images = $request->file('images');
                foreach ($images as $index => $image) {
                    $this->storeImage($image, $product->id, $index === 0); // First image as primary
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product->load('images')
            ], 201);

        } catch (\Exception $e) {
            Log::error('Product store error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Product::with('images')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'product_name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'description' => 'nullable|string',
                'size' => 'nullable|string',
                'color' => 'nullable|string',
                'slug' => 'required|string|unique:products,slug,' . $id,
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
                'existing_images' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update the product
            $product->update([
                'product_name' => $request->product_name,
                'category' => $request->category,
                'price' => $request->price,
                'stock' => $request->stock,
                'description' => $request->description,
                'size' => $request->size,
                'color' => $request->color,
                'slug' => $request->slug,
            ]);

            // Handle existing images - delete ones that are not in the keep list
            if ($request->has('existing_images')) {
                $existingImagesToKeep = json_decode($request->existing_images, true);
                $imagesToDelete = ProductImage::where('product_id', $product->id)
                    ->whereNotIn('id', $existingImagesToKeep)
                    ->get();
                
                foreach ($imagesToDelete as $image) {
                    $this->deleteImage($image);
                }

                // If no primary image exists after deletion, set the first one as primary
                $remainingImages = ProductImage::where('product_id', $product->id)->get();
                if ($remainingImages->count() > 0 && !$remainingImages->where('is_primary', true)->first()) {
                    $firstImage = $remainingImages->first();
                    $firstImage->update(['is_primary' => true]);
                }
            }

            // Handle new images upload
            if ($request->hasFile('images')) {
                $images = $request->file('images');
                $isFirstNewImage = ProductImage::where('product_id', $product->id)->count() === 0;
                
                foreach ($images as $image) {
                    $this->storeImage($image, $product->id, $isFirstNewImage);
                    $isFirstNewImage = false;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product->load('images')
            ]);

        } catch (\Exception $e) {
            Log::error('Product update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            
            // Delete all associated images
            $this->deleteProductImages($product->id);
            
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Product delete error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete individual product image
     */
   public function destroyImage($id, $imageId)
{
    try {
        $image = ProductImage::where('product_id', $id)
                            ->where('id', $imageId)
                            ->firstOrFail();

        $this->deleteImage($image);

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully'
        ]);

    } catch (\Exception $e) {
        Log::error('Image delete error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to delete image',
            'error' => $e->getMessage()
        ], 500);
    }
}
    /**
     * Store product image
     */
    private function storeImage($imageFile, $productId, $isPrimary = false)
    {
        try {
            // Generate unique filename
            $filename = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
            $path = 'products/' . $filename;
            
            // Store image
            Storage::disk('public')->put($path, file_get_contents($imageFile));
            
            // Create image record
            ProductImage::create([
                'product_id' => $productId,
                'image_path' => $path,
                'is_primary' => $isPrimary,
                'alt_text' => 'Product image'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Image store error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete individual image
     */
    private function deleteImage(ProductImage $image)
    {
        try {
            // Delete physical file
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            // Delete database record
            $image->delete();
            
        } catch (\Exception $e) {
            Log::error('Single image delete error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete all product images
     */
    private function deleteProductImages($productId, $primaryOnly = false)
    {
        try {
            $query = ProductImage::where('product_id', $productId);
            
            if ($primaryOnly) {
                $query->where('is_primary', true);
            }
            
            $images = $query->get();
            
            foreach ($images as $image) {
                $this->deleteImage($image);
            }
            
        } catch (\Exception $e) {
            Log::error('Image delete error: ' . $e->getMessage());
            throw $e;
        }
    }
}