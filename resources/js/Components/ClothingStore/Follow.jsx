import { ArrowBigRight } from 'lucide-react' // Changed from ArrowBigLeft to ArrowBigRight
import React from 'react'

export const Follow = () => {
  return (
    <section className="py-12 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12 overflow-hidden">
        <div className="p-8 md:p-12 lg:pb-72">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Follow Us Online</h2>
          <p className="text-gray-600 mb-6">
            Stay updated with our latest news, products, and promotions by following us on Instagram.
          </p>
          <a 
            className="inline-flex items-center gap-2 hover:underline font-semibold transition-colors group" 
            href="https://www.instagram.com/un_forggetable/"
            target="_blank" // Added to open in new tab
            rel="noopener noreferrer" // Added for security
          >
            Go to Instagram
            <ArrowBigRight className="transform group-hover:translate-x-1 transition-transform" size={20} />
          </a>
        </div>
        <div className="lg:w-1/2 w-full h-64 md:h-96 lg:h-auto">
          <img 
            className="w-full h-full object-cover" 
            src="/images/t2.avif" 
            alt="Instagram preview" 
          />
        </div>
      </div>
    </section>
  )
}