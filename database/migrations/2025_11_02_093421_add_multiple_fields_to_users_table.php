<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('role')->nullable()->after('email');
            $table->string('image')->nullable()->after('role');
            $table->string('phone_number')->nullable()->after('image');
            $table->string('address')->nullable()->after('phone_number');

            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn('image');
            $table->dropColumn('role');
            $table->dropColumn('phone_number');
            $table->dropColumn('address');
            
        });
    }
};
