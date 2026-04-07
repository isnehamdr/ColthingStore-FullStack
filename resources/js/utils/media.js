export const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f3f4f6'/><circle cx='50' cy='38' r='20' fill='%236b7280'/><ellipse cx='50' cy='82' rx='30' ry='18' fill='%236b7280'/></svg>`;

export const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' fill='%23f3f4f6'/><rect x='24' y='22' width='72' height='76' rx='8' fill='%23d1d5db'/><path d='M36 84l18-20 14 14 16-22 12 28H36z' fill='%239ca3af'/></svg>`;

export const getImageUrl = (imagePath, fallback = DEFAULT_AVATAR) => {
  if (!imagePath || typeof imagePath !== 'string') return fallback;

  const value = imagePath.trim();
  if (!value) return fallback;

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('blob:') ||
    value.startsWith('data:')
  ) {
    return value;
  }

  if (value.startsWith('/storage/') || value.startsWith('/images/')) {
    return value;
  }

  if (value.startsWith('storage/') || value.startsWith('images/')) {
    return `/${value}`;
  }

  return `/storage/${value.replace(/^\/+/, '')}`;
};

export const getUserImage = (user, fallback = DEFAULT_AVATAR) =>
  getImageUrl(user?.image || user?.avatar, fallback);
