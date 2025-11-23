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
import Categorypage from './Categorypage';

const Home = ({auth}) => {
	return (

		<> {/* Your clothing store components */}
			<CartProvider>
				<Navbar/>
				<Scrolldown/>
				<Hero/>
				<Categorypage/>
				<Staples/>
				<Way/>
				<Shop/>
				<Follow/>
				<Footer/>
			</CartProvider>
		</>

	);
}

export default Home;

