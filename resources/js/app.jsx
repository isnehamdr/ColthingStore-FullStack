import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './contexts/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title}  ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
        <CartProvider >
            <GoogleOAuthProvider clientId="993660695597-9j4mgtapn8hftgjnv96gt427peup4t09.apps.googleusercontent.com">
        <App {...props} />
        </GoogleOAuthProvider>
        </CartProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
