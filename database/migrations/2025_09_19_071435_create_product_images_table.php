<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('image_path'); // e.g., 'images/products/product1.jpg'
            $table->boolean('is_primary')->default(false); // Add this
            $table->timestamps();
            $table->softDeletes(); // Add this line for soft deletes
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_images');
    }
};