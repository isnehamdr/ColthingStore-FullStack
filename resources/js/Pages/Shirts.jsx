
import Footer from '@/Components/ClothingStore/Footer'
import Navbar from '@/Components/ClothingStore/Navbar'

import Scrolldown from '@/Components/ClothingStore/Scrolldown'
import Tshirt from '@/Components/ClothingStore/Tshirt'
import { CartProvider } from '@/contexts/CartContext'

import React from 'react'

const Shirts = () => {
  return (
    <>
    <CartProvider>
<Navbar/>
      <Scrolldown/>
<Tshirt/>

<Footer/>
</CartProvider>
    </>
  )
}

export default Shirts