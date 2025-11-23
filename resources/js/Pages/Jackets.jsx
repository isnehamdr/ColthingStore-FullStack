import Footer from '@/Components/ClothingStore/Footer'
import Jacket from '@/Components/ClothingStore/Jacket'
import Navbar from '@/Components/ClothingStore/Navbar'

import Scrolldown from '@/Components/ClothingStore/Scrolldown'
import { CartProvider } from '@/contexts/CartContext'
import React from 'react'

const Jackets = () => {
	return (
		<>
		<CartProvider>
			<Navbar/>
				<Scrolldown/>
				<Jacket/>
		
			<Footer/>
			</CartProvider>
		</>
	)
}

export default Jackets
