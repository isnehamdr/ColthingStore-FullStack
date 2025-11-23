import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleGoogleLogin = () => {
        window.location.href = route('google.login');
    };

    return (
        <>
            <Head title="Log in" />
            
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* Left Column - Login Form */}
                    <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
                        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                            
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    SIGN IN
                                </h2>
                                <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    Welcome back! Please sign in to your account.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 p-4 text-sm text-green-600 bg-green-50 rounded-lg border border-green-200">
                                    {status}
                                </div>
                            )}

                            {/* Login Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <InputLabel 
                                        htmlFor="email" 
                                        value="Email Address" 
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="email"
                                        required
                                        isFocused={true}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                        placeholder="Enter your email"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <InputLabel 
                                        htmlFor="password" 
                                        value="Password" 
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    />

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                        placeholder="Enter your password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />

                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>
                                    
                                    {canResetPassword && (
                                        <div className="text-sm">
                                            <Link
                                                href={route('password.request')}
                                                className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Sign In Button */}
                                <PrimaryButton 
                                    className="w-full justify-center bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200 font-medium text-sm lg:text-base"
                                    disabled={processing}
                                >
                                    {processing ? 'Signing in...' : 'Sign in'}
                                </PrimaryButton>
                            </form>

                            {/* Divider */}
                            <div className="mt-8 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button 
                                    type="button"
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    onClick={() => console.log('Facebook login')}
                                >
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                                </button>
                                
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Google</span>
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link 
                                        href={route('register')} 
                                        className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="relative w-full h-full max-h-[600px]">
                            <img 
                                src="/images/hero.avif" 
                                alt="Login illustration" 
                                className="w-full h-full object-cover rounded-2xl shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
                            <div className="absolute bottom-8 left-8 text-white">
                                <h3 className="text-2xl font-bold mb-2">Welcome Back!</h3>
                                <p className="text-lg opacity-90">Sign in to continue your journey with us.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}