import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Welcome back, {auth.user.name}!</h3>
                                <Link 
                                    href={route('home')} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                                >
                                    Go to Store Home
                                </Link>
                            </div>
                            
                            <div className="border-t pt-4">
                                <h4 className="text-lg font-semibold mb-3">Your Dashboard</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h5 className="font-medium text-blue-800">Recent Orders</h5>
                                        <p className="text-sm mt-2 text-blue-600">You have no recent orders.</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <h5 className="font-medium text-green-800">Wishlist</h5>
                                        <p className="text-sm mt-2 text-green-600">Your wishlist is empty.</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                        <h5 className="font-medium text-purple-800">Account Settings</h5>
                                        <p className="text-sm mt-2 text-purple-600">Manage your preferences.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}