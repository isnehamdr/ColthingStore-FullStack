import Category from '@/Components/ClothingStore/Category';
import {Follow} from '@/Components/ClothingStore/Follow';
import Footer from '@/Components/ClothingStore/Footer';
import Hero from '@/Components/ClothingStore/Hero';
import Shop from '@/Components/ClothingStore/Shop';
import Staples from '@/Components/ClothingStore/Staples';
import {Way} from '@/Components/ClothingStore/Way';
import Navbar from '@/Components/ClothingStore/Navbar';
import Scrolldown from '@/Components/ClothingStore/Scrolldown';
import {CartProvider} from '@/contexts/CartContext';

const Welcome = ({auth}) => {
	return (

		<> {/* Your clothing store components */}
			<CartProvider>
				<Navbar/>
				<Scrolldown/>
				<Hero/>
				<Category/>
				<Staples/>
				<Way/>
				<Shop/>
				<Follow/>
				<Footer/>
			</CartProvider>
		</>

	);
}

export default Welcome;
// import Category from '@/Components/ClothingStore/Category';
// import { Follow } from '@/Components/ClothingStore/Follow';
// import Footer from '@/Components/ClothingStore/Footer';
// import Hero from '@/Components/ClothingStore/Hero';
// import Shop from '@/Components/ClothingStore/Shop';
// import Staples from '@/Components/ClothingStore/Staples';
// import { Way } from '@/Components/ClothingStore/Way';
// import Navbar from '@/Components/ClothingStore/Navbar';
// import Scrolldown from '@/Components/ClothingStore/Scrolldown';
// import { CartProvider } from '@/Contexts/CartContext';

// const Welcome = ({ auth }) => {
//     return (
//         <CartProvider>
//             <>
//                 {/* Your clothing store components */}
//                 <Navbar/>
//                 <Scrolldown/>
//                 <Hero/>
//                 <Category/>
//                 <Staples/>
//                 <Way/>
//                 <Shop/>
//                 <Follow/>
//                 <Footer/>
//             </>
//         </CartProvider>
//     );
// }

// export default Welcome;
