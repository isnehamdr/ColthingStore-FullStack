<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->string('category');
            $table->decimal('price', 10, 2); // Changed to decimal for better precision
            $table->integer('stock')->default(0);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->longText('description')->nullable();
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->string('slug')->unique();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};