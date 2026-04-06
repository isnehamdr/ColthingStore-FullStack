# ClothingStore

ClothingStore  is a Laravel 12 + React/Inertia ecommerce application for browsing clothing products, managing orders, and running an admin dashboard. The project includes customer shopping flows, authentication, Google sign-in, order confirmation email support, and a Google Analytics reporting page.

## Features

- Customer-facing storefront for shirts, pants, jackets, categories, and product detail pages
- Shopping cart and checkout flow
- Order creation with itemized order records
- Order confirmation email delivery
- Authentication with Laravel Breeze
- Google OAuth login with Socialite
- Admin product management with multi-image upload
- Order management with status updates
- User management and activity logging
- Analytics dashboard backed by Google Analytics 4

## Tech Stack

- Backend: Laravel 12, PHP 8.2
- Frontend: React 18, Inertia.js, Vite
- Styling: Tailwind CSS
- Auth: Laravel Breeze, Laravel Sanctum, Laravel Socialite
- Charts and UI helpers: Recharts, Lucide React, React Hook Form, React Hot Toast
- Analytics: `spatie/laravel-analytics`, Google API Client

## Project Structure

- `app/Http/Controllers` contains product, order, user, analytics, and auth controllers
- `resources/js/Pages` contains customer pages, admin pages, and auth screens
- `resources/js/Components` contains reusable UI components
- `database/migrations` defines users, products, product images, orders, order items, and activity logs
- `resources/views/emails/order-confirmation.blade.php` contains the order email template

## Getting Started

### 1. Install dependencies

```bash
composer install
npm install
```

### 2. Configure environment

Copy the environment file and generate the app key:

```bash
copy .env.example .env
php artisan key:generate
```

Update `.env` with your database and app settings.

### 3. Run migrations

```bash
php artisan migrate
```

To load the default sample user from `DatabaseSeeder`:

```bash
php artisan db:seed
```

Default seeded account:

- Email: `test@example.com`

### 4. Create the storage link

Product images are stored on the public disk, so create the storage symlink:

```bash
php artisan storage:link
```

### 5. Start the development servers

Run Laravel and Vite together:

```bash
composer run dev
```

Or run them separately:

```bash
php artisan serve
npm run dev
```

## Important Environment Variables

Add these when enabling optional integrations:

```env
APP_NAME="ClothingStore"
APP_URL=http://localhost:8000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

ANALYTICS_PROPERTY_ID=

MAIL_MAILER=
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME="${APP_NAME}"
```

## Google Analytics Setup

This project expects a Google service account credentials file at:

```text
storage/app/analytics/clothingstore.json
```

Also set `ANALYTICS_PROPERTY_ID` in `.env` for your GA4 property.

## Main Routes

### Public pages

- `/`
- `/home`
- `/shirt`
- `/pant`
- `/jacket`
- `/allproduct`
- `/contact`
- `/categories`
- `/checkout`
- `/detailpage/{slug}`

### Authenticated pages

- `/dashboard`
- `/profile`
- `/ourorders`
- `/users`

### Admin-focused pages

- `/activitylog`
- `/analytics`
- product create/update/delete via `/ourproducts`

## API-style Endpoints Used By The Frontend

- `GET /ourproducts`
- `POST /ourproducts`
- `PUT /ourproducts/{id}`
- `DELETE /ourproducts/{id}`
- `GET /ourorders`
- `POST /ourorders`
- `PUT /ourorders/{id}`
- `DELETE /ourorders/{id}`
- `GET /dashboard/stats`
- `GET /analytics/data`

## Notes

- Product creation supports multiple image uploads.
- Orders are linked to the logged-in user when available.
- Customers can view their own orders, while admins can view all orders.
- Order confirmation emails are sent after successful order creation.
- Google login is available through `/auth/google/redirect`.

## License

This project uses the MIT license.
