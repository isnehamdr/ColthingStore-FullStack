import { Star, StarHalf, ChevronRight, Minus, Plus, ShoppingCart, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { formatNpr } from '@/utils/storefront'

const ViewDetails = () => {
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  
  const sizes = ['S', 'M', 'XL']
  
  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li className="cursor-pointer hover:text-gray-700">Home</li>
          <ChevronRight size={16} />
          <li className="cursor-pointer hover:text-gray-700">Shirts</li>
          <ChevronRight size={16} />
          <li className="text-gray-900">Cotton T-shirt</li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="flex flex-col">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
            <img 
              src="/images/t1.avif" 
              alt="White Cotton T-shirt" 
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* Reviews Section */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
            <div className="flex items-center mb-2">
              <div className="flex text-amber-500">
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <StarHalf fill="currentColor" size={20} />
              </div>
              <span className="ml-2 font-medium">4.8/5</span>
            </div>
            <p className="text-gray-600 mb-4">Based on 5 reviews</p>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              Leave a Review
            </button>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">White Cotton T-shirt</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-amber-500 mr-2">
              <Star fill="currentColor" size={16} />
              <Star fill="currentColor" size={16} />
              <Star fill="currentColor" size={16} />
              <Star fill="currentColor" size={16} />
              <StarHalf fill="currentColor" size={16} />
            </div>
            <span className="text-sm text-gray-500">(4.8)</span>
          </div>
          
          <p className="text-2xl font-bold text-gray-900 mb-6">{formatNpr(28)}</p>
          
          <p className="text-gray-600 mb-6">
            I'm a product overview. I'm a great place to include more information about your product. 
            Buyers like to know what they're getting before they purchase.
          </p>
          
          {/* Size Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Size: {selectedSize}</h3>
            <div className="flex space-x-3">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center rounded-md border ${
                    selectedSize === size 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  } transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center border border-gray-300 rounded-md w-32">
              <button 
                onClick={decreaseQuantity}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Minus size={16} />
              </button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <button className="flex items-center justify-center bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors flex-1">
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
            <button className="flex items-center justify-center border border-gray-300 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors flex-1">
              <Zap size={20} className="mr-2" />
              Buy Now
            </button>
          </div>
          
          {/* Product Information Accordion */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Info</h2>
              <p className="text-gray-600">
                I'm a product detail. I'm a great place to add more details about your product such as sizing, 
                material, care instructions and cleaning instructions.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Return & Refund Policy</h2>
              <p className="text-gray-600">
                I'm a policy section. I'm a great place to add more details about your return and refund policy.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Shipping Info</h2>
              <p className="text-gray-600">
                I'm a shipping detail. I'm a great place to add more details about your shipping methods and timelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewDetails
