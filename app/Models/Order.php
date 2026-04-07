<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'email',
        'phone',
        'first_name',
        'last_name',
        'address',
        'apartment',
        'city',
        'postal_code',
        'country',
        'payment_method',
        'subtotal',
        'shipping',
        'tax',
        'total',
        'status',
        'card_last_four',
        'transaction_id',
        'payment_reference',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
