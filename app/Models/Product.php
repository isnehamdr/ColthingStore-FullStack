<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_name',
        'category',
        'price',
        'stock',
        'description',
        'discount_price',
        'size', // Changed from 'sizes'
        'color', // Changed from 'colors'
        'slug',
    ];

protected static function boot()
{
    parent::boot();

    static::creating(function ($product) {
        // Create a basic slug first (before ID exists)
        $product->slug = Str::slug($product->product_name) . '-' . Str::random(6);
    });

    static::created(function ($product) {
        // After creation we now have $product->id
        $finalSlug = Str::slug($product->product_name) .  '-' . rand(100000, 999999);

        // Ensure uniqueness
        while (self::where('slug', $finalSlug)->exists()) {
            $finalSlug = Str::slug($product->product_name) . '-' . rand(100000, 999999);
        }

        $product->slug = $finalSlug;
        $product->save();
    });
}


    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}