import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#bebaa7] ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[4fr_2.5fr] gap-0 min-h-screen">
        {/* First Div - Company Name and Description */}
        <div className="lg:col-span-2 lg:row-span-1 bg-[#bebaa7] p-8 border border-gray-700">
          <h2 className="text-3xl  font-md mb-4 uppercase">RoonApparel</h2>
          <p className="mb-8">
            We create innovative solutions for the digital world. Our mission is to help businesses grow with cutting-edge technology and exceptional service.
          </p>
        </div>

        {/* Second Div - Newsletter Subscription */}
        <div className="lg:col-span-2 lg:row-span-1 bg-[#bebaa7] p-8 border border-gray-700">
          <h2 className="text-xl lg:text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
          <p className="mb-6 text-md">
            Stay updated with our latest news, products, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
            />
            <button className="border border-gray-700 px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Third Div - Shop Navitems */}
        <div className="lg:col-span-1 lg:row-span-1 bg-[#bebaa7] p-8 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-md">
            <li><a href="#" className="hover: transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover: transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover: transition-colors">Men's Collection</a></li>
            <li><a href="#" className="hover: transition-colors">Women's Collection</a></li>
            <li><a href="#" className="hover: transition-colors">Sale</a></li>
            <li><a href="#" className="hover: transition-colors">Accessories</a></li>
          </ul>
        </div>

        {/* Fourth Div - Policy and Terms */}
        <div className="lg:col-span-1 lg:row-span-1 bg-[#bebaa7] p-8 border border-gray-500">
          <h3 className="text-lg font-semibold mb-4">Policy & Terms</h3>
          <ul className="space-y-2 text-md">
            <li><a href="#" className="hover: transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover: transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover: transition-colors">Return Policy</a></li>
            <li><a href="#" className="hover: transition-colors">Shipping Information</a></li>
            <li><a href="#" className="hover: transition-colors">FAQ</a></li>
            <li><a href="#" className="hover: transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        {/* Fifth Div - Follow Us with Social Icons */}
        <div className="lg:col-span-1 lg:row-span-1 bg-[#bebaa7] p-8 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
            <a href="#" className="flex items-center hover: transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              Facebook
            </a>
            <a href="#" className="flex items-center hover: transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              Twitter
            </a>
            <a href="#" className="flex items-center hover: transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              Instagram
            </a>
            <a href="#" className="flex items-center hover: transition-colors">
              <svg className="w-5 h-5 mr-2" fill="CurrentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
              LinkedIn
            </a>
            <a href="#" className="flex items-center hover: transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.051 5.238c-.885-.379-2.332-.881-3.594-.882-1.258 0-2.437.363-3.357 1.027-1.008.72-1.601 1.756-1.601 2.94 0 1.328.737 2.237 1.691 2.789.87.48 1.991.73 3.287.73h.521c-.083.31-.125.634-.125.966 0 1.907 1.393 3.477 3.167 3.823.196.04.396.06.6.06h6.667c.184 0 .366-.018.544-.054 1.787-.331 3.122-1.875 3.122-3.829 0-.332-.042-.656-.125-.966h.521c1.296 0 2.417-.25 3.287-.73.954-.552 1.691-1.461 1.691-2.789 0-1.184-.593-2.22-1.601-2.94-.92-.664-2.099-1.027-3.357-1.027-1.262.001-2.709.503-3.594.882-.885.379-1.642.754-2.284.754h-3.33c-.642 0-1.399-.375-2.284-.754zm13.949 8.762c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm-16 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
              </svg>
              Pinterest
            </a>
            <a href="#" className="flex items-center hover: transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        {/* Sixth Div - Contact Information */}
        <div className="lg:col-span-1 lg:row-span-1 bg-[#bebaa7] p-8 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <ul className="space-y-3 text-md">
            <li className="flex items-start">
              <svg className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="">123 Business Ave, Suite 101<br />New York, NY 10001</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span className="">+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span className="">info@company.com</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="">Mon-Fri: 9AM-5PM</span>
            </li>
          </ul>
        </div>
      </div>

     {/* Copyright Section */}
<div className="bg-[#bebaa7] py-6 border-t border-[#bebaa7]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p className="text-sm">© {new Date().getFullYear()} ROONAPPAREL. All rights reserved.</p>
    <p className="text-sm mt-2">Designed and Developed with ❤️ by Isneha</p>
  </div>
</div>
    </footer>
  );
};

export default Footer;