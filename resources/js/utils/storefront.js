import { DEFAULT_PRODUCT_IMAGE, getImageUrl } from '@/utils/media';

export const formatNpr = (amount) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

export const parseOptionList = (value, fallback = []) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
};

export const resolveCategoryRoute = (category) => {
  const value = String(category || '').toLowerCase();

  if (value.includes('shirt')) return '/shirt';
  if (value.includes('pant') || value.includes('trouser') || value.includes('jean')) return '/pant';
  if (value.includes('jacket') || value.includes('coat')) return '/jacket';

  return '/allproduct';
};

export const normalizeStorefrontProduct = (product) => {
  const originalPrice = Number(product?.price || 0);
  const discountPrice = product?.discount_price === null || product?.discount_price === undefined
    ? null
    : Number(product.discount_price);
  const effectivePrice = discountPrice && discountPrice < originalPrice ? discountPrice : originalPrice;
  const imagePath = product?.image_url || product?.images?.[0]?.image_path || '';

  return {
    ...product,
    name: product?.product_name || product?.name || 'Product',
    label: product?.product_name || product?.name || 'Product',
    price: effectivePrice,
    original_price: originalPrice,
    discount_price: discountPrice,
    on_sale: Boolean(product?.is_sale) || (discountPrice !== null && discountPrice < originalPrice),
    image: getImageUrl(imagePath, DEFAULT_PRODUCT_IMAGE),
    image_url: getImageUrl(imagePath, DEFAULT_PRODUCT_IMAGE),
    sizes: parseOptionList(product?.size, ['M']),
    colors: parseOptionList(product?.color, ['Default']),
    rating: Number(product?.rating || 4),
    reviews_count: Number(product?.reviews_count || 0),
    description: product?.description || '',
    is_sale: Boolean(product?.is_sale),
    sale_category: product?.sale_category || null,
    discount_amount: Number(product?.discount_amount || 0),
    discount_percent: Number(product?.discount_percent || 0),
  };
};

export const buildFilterOptions = (products) => {
  const colors = [...new Set(products.flatMap((product) => product.colors || []))].filter(Boolean);
  const sizes = [...new Set(products.flatMap((product) => product.sizes || []))].filter(Boolean);
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];

  return { colors, sizes, categories };
};
