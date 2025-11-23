import Footer from '@/Components/ClothingStore/Footer'
import Navbar from '@/Components/ClothingStore/Navbar'
import { CartProvider } from '@/contexts/CartContext'
import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import Scrolldown from '@/Components/ClothingStore/Scrolldown'

const Contact = () => {
  const publicKey = import.meta.env.VITE_public_key
  const serviceId = import.meta.env.VITE_service_id
  const templateId = import.meta.env.VITE_template_id

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_name: 'Clothing Store Team'
      }

      // Send email using EmailJS
      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey)
      
      console.log('Email sent successfully:', result)
      alert('Thank you for your message! We will get back to you soon.')
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Sorry, there was an error sending your message. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <CartProvider>
        <Navbar/>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className='text-4xl md:text-5xl font-serif font-normal text-gray-900 mb-6'>Contact Us</h1>
              <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto'>Have a question about our clothing collection or need assistance? We'd love to hear from you.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-12 mt-16">
              <div className="w-full lg:w-2/5">
                <div className="rounded-xl p-8 h-full">
                  <h3 className="text-2xl font-serif font-normal text-gray-900 mb-6">Get in Touch</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Visit Our Store</h4>
                        <p className="mt-1 text-gray-600">123 Fashion Avenue<br />New York, NY 10001</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Call Us</h4>
                        <p className="mt-1 text-gray-600">+1 (555) 123-4567<br />Mon-Fri, 9am-5pm EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Email Us</h4>
                        <p className="mt-1 text-gray-600">support@clothingstore.com<br />We reply within 24 hours</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <h3 className="text-2xl font-serif font-normal text-gray-900 mb-6">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-500 hover:text-gray-900">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-900">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-gray-900">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-3/5">
                <div className="p-8">
                  <h3 className="text-2xl font-serif font-normal text-gray-900 mb-6">Send us a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First name*</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="Your first name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last name*</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone*</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`border rounded-2xl px-8 py-2 italic bg-[#bebaa7] border-gray-900 font-medium transition-colors ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#a8a595]'
                        }`}
                      >
                        {isSubmitting ? 'Sending...' : 'Submit'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Scrolldown/>
        <Footer/>
      </CartProvider>
    </>
  )
}

export default Contact
// import React, { useState } from 'react';
// import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
// import Navbar from '@/Components/ClothingStore/Navbar';
// import Footer from '@/Components/ClothingStore/Footer';

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     message: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Simulated submission
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       alert('Thank you for your message! We will get back to you soon.');
      
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         message: ''
//       });
//     } catch (error) {
//       console.error('Error sending email:', error);
//       alert('Sorry, there was an error sending your message. Please try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Contact Us
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Have questions about our products or services? We're here to help and would love to hear from you.
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* Contact Information Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sticky top-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Get In Touch
//               </h2>
              
//               <div className="space-y-6">
//                 {/* Address */}
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                     <MapPin className="w-5 h-5 text-gray-700" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
//                     <p className="text-gray-600 text-sm leading-relaxed">
//                       123 Fashion Avenue<br />
//                       New York, NY 10001<br />
//                       United States
//                     </p>
//                   </div>
//                 </div>

//                 {/* Phone */}
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                     <Phone className="w-5 h-5 text-gray-700" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
//                     <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
//                     <p className="text-gray-500 text-xs mt-1">Mon-Fri, 9:00 AM - 5:00 PM EST</p>
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                     <Mail className="w-5 h-5 text-gray-700" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
//                     <p className="text-gray-600 text-sm">support@clothingstore.com</p>
//                     <p className="text-gray-500 text-xs mt-1">We reply within 24 hours</p>
//                   </div>
//                 </div>

//                 {/* Business Hours */}
//                 <div className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                     <Clock className="w-5 h-5 text-gray-700" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
//                     <p className="text-gray-600 text-sm">
//                       Monday - Friday: 9:00 AM - 5:00 PM<br />
//                       Saturday: 10:00 AM - 4:00 PM<br />
//                       Sunday: Closed
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Social Media */}
//               <div className="mt-8 pt-8 border-t border-gray-200">
//                 <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
//                 <div className="flex space-x-3">
//                   <a 
//                     href="#" 
//                     className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
//                     aria-label="Facebook"
//                   >
//                     <Facebook className="w-5 h-5 text-gray-700" />
//                   </a>
//                   <a 
//                     href="#" 
//                     className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
//                     aria-label="Instagram"
//                   >
//                     <Instagram className="w-5 h-5 text-gray-700" />
//                   </a>
//                   <a 
//                     href="#" 
//                     className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
//                     aria-label="Twitter"
//                   >
//                     <Twitter className="w-5 h-5 text-gray-700" />
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Send Us a Message
//               </h2>
//               <p className="text-gray-600 mb-8">
//                 Fill out the form below and we'll get back to you as soon as possible.
//               </p>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Name Fields */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="firstName"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       placeholder="John"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="lastName"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       placeholder="Doe"
//                     />
//                   </div>
//                 </div>

//                 {/* Email and Phone */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       placeholder="john.doe@example.com"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone Number <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       id="phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       placeholder="(555) 123-4567"
//                     />
//                   </div>
//                 </div>

//                 {/* Message */}
//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
//                     Message
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     rows={6}
//                     value={formData.message}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
//                     placeholder="Tell us how we can help you..."
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex items-center justify-between pt-4">
//                   <p className="text-sm text-gray-500">
//                     <span className="text-red-500">*</span> Required fields
//                   </p>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className={`px-8 py-3 bg-gray-900 text-white font-medium rounded-lg transition-all ${
//                       isSubmitting 
//                         ? 'opacity-50 cursor-not-allowed' 
//                         : 'hover:bg-gray-800 hover:shadow-lg'
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center">
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Sending...
//                       </span>
//                     ) : (
//                       'Send Message'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>

//             {/* Additional Info Card */}
//             <div className="mt-8  border border-gray-200 rounded-lg p-6">
//               <h3 className="font-semibold text-gray-900 mb-2">Need Immediate Assistance?</h3>
//               <p className="text-gray-700 text-sm">
//                 For urgent inquiries, please call us directly at <span className="font-medium">+1 (555) 123-4567</span> during business hours, or visit our store location for in-person support.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// };

// export default Contact;