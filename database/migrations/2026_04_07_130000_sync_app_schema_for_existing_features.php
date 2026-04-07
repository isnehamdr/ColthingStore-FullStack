<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (!Schema::hasColumn('orders', 'phone')) {
                    $table->string('phone')->nullable()->after('email');
                }
                if (!Schema::hasColumn('orders', 'apartment')) {
                    $table->string('apartment')->nullable()->after('address');
                }
                if (!Schema::hasColumn('orders', 'payment_method')) {
                    $table->string('payment_method')->nullable()->after('country');
                }
                if (!Schema::hasColumn('orders', 'tax')) {
                    $table->decimal('tax', 10, 2)->default(0)->after('shipping');
                }
                if (!Schema::hasColumn('orders', 'card_last_four')) {
                    $table->string('card_last_four')->nullable()->after('status');
                }
                if (!Schema::hasColumn('orders', 'transaction_id')) {
                    $table->string('transaction_id')->nullable()->after('card_last_four');
                }
                if (!Schema::hasColumn('orders', 'payment_reference')) {
                    $table->string('payment_reference')->nullable()->after('transaction_id');
                }
            });
        }

        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                if (!Schema::hasColumn('order_items', 'seller_id')) {
                    $table->unsignedBigInteger('seller_id')->nullable()->after('image');
                }
                if (!Schema::hasColumn('order_items', 'seller_name')) {
                    $table->string('seller_name')->nullable()->after('seller_id');
                }
            });
        }

        if (Schema::hasTable('product_images')) {
            Schema::table('product_images', function (Blueprint $table) {
                if (!Schema::hasColumn('product_images', 'alt_text')) {
                    $table->string('alt_text')->nullable()->after('is_primary');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                foreach (['phone', 'apartment', 'payment_method', 'tax', 'card_last_four', 'transaction_id', 'payment_reference'] as $column) {
                    if (Schema::hasColumn('orders', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }

        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                foreach (['seller_id', 'seller_name'] as $column) {
                    if (Schema::hasColumn('order_items', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }

        if (Schema::hasTable('product_images') && Schema::hasColumn('product_images', 'alt_text')) {
            Schema::table('product_images', function (Blueprint $table) {
                $table->dropColumn('alt_text');
            });
        }
    }
};
