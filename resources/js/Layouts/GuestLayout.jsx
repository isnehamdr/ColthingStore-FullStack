
import Footer from '@/Components/ClothingStore/Footer';
import Navbar from '@/Components/ClothingStore/Navbar';


export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Navbar */}
           
                <Navbar />
                
                

                {/* Main Content */}
                <div className="flex flex-grow items-center justify-center">
                    <div className="w-full">{children}</div>
                </div>
               

                <Footer />
          
        </div>
    );
}