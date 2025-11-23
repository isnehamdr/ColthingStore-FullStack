import Footer from '@/Components/ClothingStore/Footer'
import Navbar from '@/Components/ClothingStore/Navbar'
import Pant from '@/Components/ClothingStore/Pant'
import Scrolldown from '@/Components/ClothingStore/Scrolldown'
import { CartProvider } from '@/contexts/CartContext'
import React from 'react'

const Pants = () => {
	return (
		<>
		<CartProvider>
			<Navbar/>
				<Scrolldown/>
				<Pant/>
		
			<Footer/>
			</CartProvider>
		</>
	)
}

export default Pants
